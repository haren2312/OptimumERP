const { contactDto } = require("../dto/contact.dto");
const requestAsyncHandler = require("../handlers/requestAsync.handler");
const Party = require("../models/party.model");
const { PartyNotFound } = require("../errors/party.error");
const Contact = require("../models/contacts.model");
const { ContactNotFound } = require("../errors/contact.error");
const { isValidObjectId } = require("mongoose");
const logger = require("../logger");
const OrgModel = require("../models/org.model");
exports.createContact = requestAsyncHandler(async (req, res) => {
  const body = await contactDto.validateAsync(req.body);
  if (body.party) {
    const party = await Party.findById(body.party);
    if (!party) throw new PartyNotFound();
  }
  const contact = await Contact.create({ ...body, org: req.params.orgId });
  logger.log("info", `Contact created with id ${contact.id}`);
  await OrgModel.updateOne(
    { _id: req.params.orgId },
    { $inc: { "relatedDocsCount.contacts": 1 } }
  );
  return res.status(200).json({ data: contact });
});

exports.getContacts = requestAsyncHandler(async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const filter = {
    org: req.params.orgId,
  };
  const search = req.query.search || "";
  const type = req.query.type;
  const party = req.query.party;
  if (search) filter.$text = { $search: search };
  if (type) filter.type = type;
  if (isValidObjectId(party)) filter.party = party;
  const totalContacts = await Contact.countDocuments(filter);
  const totalPages = Math.ceil(totalContacts / limit);

  const skip = (page - 1) * limit;
  const contacts = await Contact.find(filter)
    .populate("party")
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);
  return res.status(200).json({
    currentPage: page,
    limit,
    totalPages,
    total: totalContacts,
    data: contacts,
  });
});

exports.updateContact = requestAsyncHandler(async (req, res) => {
  const body = await contactDto.validateAsync(req.body);
  const updatedContact = await Contact.findOneAndUpdate(
    {
      _id: req.params.id,
      org: req.params.orgId,
    },
    body
  );
  if (!updatedContact) throw new ContactNotFound();
  logger.log("info", `Contact updated with id ${updatedContact.id}`);

  return res
    .status(200)
    .json({ data: updatedContact, message: "Contact updated" });
});
exports.deleteContact = requestAsyncHandler(async (req, res) => {
  const deletedContact = await Contact.findOneAndDelete({
    _id: req.params.id,
    org: req.params.orgId,
  });
  if (!deletedContact) throw new ContactNotFound();
  logger.log("info", `Contact deleted with id ${deletedContact.id}`);
  await OrgModel.updateOne(
    { _id: req.params.orgId },
    { $inc: { "relatedDocsCount.contacts": -1 } }
  );
  return res.status(200).json({ message: "Contact deleted" });
});

exports.getContact = requestAsyncHandler(async (req, res) => {
  const contact = await Contact.findOne({
    _id: req.params.id,
    org: req.params.orgId,
  }).populate("party");
  if (!contact) throw new ContactNotFound();
  return res.status(200).json({ data: contact });
});
