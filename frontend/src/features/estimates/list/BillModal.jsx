import {
  Button,
  ButtonGroup,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Skeleton,
} from "@chakra-ui/react";
import { CiSaveDown2 } from "react-icons/ci";
import instance, { baseURL } from "../../../instance";
import { useState } from "react";
import useAsyncCall from "../../../hooks/useAsyncCall";
export default function BillModal({ onClose, isOpen, bill, entity, heading }) {
  const { requestAsyncHandler } = useAsyncCall();
  const [status, setStatus] = useState("idle");
  const [billLoadStatus, setBillLoadStatus] = useState("loading");
  const downloadBillUrl = `/api/v1/organizations/${bill.org._id}/${entity}/${bill._id}/download`;
  const onSaveBill = requestAsyncHandler(async () => {
    setStatus("loading");
    const { data } = await instance.get(downloadBillUrl);
    setStatus("success");
    const billPrint = window.open("", "");
    billPrint.document.write(data);
    billPrint.document.close();
    billPrint.onload = function () {
      billPrint.focus();
      billPrint.print();
      billPrint.close();
    };
  });
  const isBillLoading = billLoadStatus === "idle";
  return (
    <Modal
      size={"full"}
      onClose={onClose}
      isOpen={isOpen}
      scrollBehavior={"inside"}
    >
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>{heading}</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Skeleton isLoaded={isBillLoading}>
            <iframe
              onLoad={() => {
                setBillLoadStatus("idle");
              }}
              style={{
                padding: 2,
                borderRadius: 10,
              }}
              width={"100%"}
              height={720}
              src={`${baseURL}${downloadBillUrl}`}
              frameBorder="0"
            />
          </Skeleton>
        </ModalBody>
        <ModalFooter>
          <ButtonGroup>
            <Button onClick={onClose}>Close</Button>
            <Button
              leftIcon={<CiSaveDown2 />}
              onClick={onSaveBill}
              colorScheme="blue"
              isLoading={status === "loading"}
            >
              Save as PDF
            </Button>
          </ButtonGroup>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
