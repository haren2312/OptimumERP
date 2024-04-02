import {
  Box,
  Flex,
  Grid,
  SimpleGrid,
  Spinner,
  Stack,
  Tag,
  TagLabel,
} from "@chakra-ui/react";
import { Select } from "chakra-react-select";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import useQuery from "../../hooks/useQuery";
import instance from "../../instance";
import MainLayout from "../common/main-layout";
import Pagination from "../common/main-layout/Pagination";
import TableLayout from "../common/table-layout";
import DateFilter from "../estimates/list/DateFilter";
import BalanceStats from "./BalanceStats";
import BillStatsByStatus from "./BillStatsByStatus";
export default function TransactionsPage() {
  const { partyId, orgId } = useParams();
  const query = useQuery();
  const currentPage = query.get("page") || 1;
  const today = new Date();
  const sevenDaysAgo = new Date(today);
  sevenDaysAgo.setDate(today.getDate() - 7);

  const [dateFilter, setDateFilter] = useState({
    startDate: sevenDaysAgo.toISOString().split("T")[0],
    endDate: today.toISOString().split("T")[0],
  });
  const [purchasesByStatus, setPurchaseByStatus] = useState([]);
  const [invoicesByStatus, setInvoicesByStatus] = useState([]);
  const onChangeDateFilter = (e) =>
    setDateFilter({
      ...dateFilter,
      [e.currentTarget.name]: e.currentTarget.value,
    });
  const [transactionsResponse, setTransactionsResponse] = useState({
    items: [],
    page: 0,
    totalPages: 0,
    total: 0,
    party: null,
  });
  const [status, setStatus] = useState("idle");
  const typeOfTransactions = [
    {
      value: "invoice",
      label: "Invoice",
    },
    {
      value: "purchase",
      label: "Purchase",
    },
    {
      value: "quotes",
      label: "Quotation",
    },
  ];
  const [selectedTypeOfTransactions, setSelectedTypeOfTransactions] = useState(
    typeOfTransactions.slice(0, 2)
  );
  const [invoiceBalance, setInvoiceBalance] = useState({
    total: 0,
    amountReceived: 0,
  });
  const transactionTypes = selectedTypeOfTransactions
    .map((option) => option.value)
    .join(",");
  useEffect(() => {
    (async () => {
      setStatus("loading");
      const { data } = await instance.get(
        `/api/v1/organizations/${orgId}/parties/${partyId}/transactions`,
        {
          params: {
            page: currentPage,
            transactionTypes,
            startDate: dateFilter.startDate,
            endDate: dateFilter.endDate,
          },
        }
      );
      setPurchaseByStatus(data.purchasesByStatus);
      setInvoiceBalance(data.invoiceBalance);
      setInvoicesByStatus(data.invoicesByStatus);
      setTransactionsResponse({
        items: data.data,
        page: data.page,
        total: data.total,
        totalPages: data.totalPages,
        party: data.party,
      });
      setStatus("idle");
    })();
  }, [orgId, partyId, currentPage, transactionTypes, dateFilter]);
  const loading = status === "loading";
  const purchaseTotal = purchasesByStatus.reduce(
    (prev, purchaseType) =>
      purchaseType._id === "unpaid" ? prev + purchaseType.total : prev,
    0
  );
  return (
    <MainLayout>
      <Box p={5}>
        {loading ? (
          <Flex justifyContent={"center"} alignItems={"center"}>
            <Spinner size={"md"} />
          </Flex>
        ) : (
          <TableLayout
            filter={
              <Stack spacing={3}>
                <SimpleGrid gap={3} minChildWidth={200}>
                  {invoicesByStatus.length ? (
                    <BillStatsByStatus
                      invoicesByStatus={invoicesByStatus}
                      label={"Invoices"}
                    />
                  ) : null}
                  {purchasesByStatus.length ? (
                    <BillStatsByStatus
                      invoicesByStatus={purchasesByStatus}
                      label={"Purchase"}
                    />
                  ) : null}
                  <BalanceStats
                    balance={
                      invoiceBalance.total -
                      invoiceBalance.amountReceived -
                      purchaseTotal
                    }
                  />
                </SimpleGrid>
                <Select
                  isMulti
                  onChange={setSelectedTypeOfTransactions}
                  options={typeOfTransactions}
                  value={selectedTypeOfTransactions}
                />
                <Grid gap={3} gridTemplateColumns={"1fr 1fr"}>
                  <DateFilter
                    dateFilter={dateFilter}
                    onChangeDateFilter={onChangeDateFilter}
                  />
                </Grid>
              </Stack>
            }
            heading={`${
              transactionsResponse.party ? transactionsResponse.party.name : ""
            } - Transactions`}
            tableData={transactionsResponse.items.map((item) => ({
              _id: item._id,
              date: new Date(item.doc.date).toLocaleDateString(),
              totalItems: item.doc.items.length,
              status: item.doc.status,
              num: item.doc.num || item.doc.purchaseNo,
              grandTotal: (item.total + item.totalTax).toFixed(2),
              type: (
                <Tag
                  size={"md"}
                  variant="subtle"
                  colorScheme={
                    item.docModel === "quotes"
                      ? "yellow"
                      : item.docModel === "invoice"
                      ? "green"
                      : "cyan"
                  }
                >
                  <TagLabel>{item.docModel.toUpperCase()}</TagLabel>
                </Tag>
              ),
            }))}
            caption={`Total Transactions found : ${transactionsResponse.total}`}
            operations={[]}
            selectedKeys={{
              date: "Transactions Date",
              num: "Transaction Number",
              totalItems: "Total Items",
              type: "Type of Transaction",
              status: "Status",
              grandTotal: "Grand Total",
            }}
          />
        )}
        {loading ? null : (
          <Pagination
            currentPage={transactionsResponse.page}
            total={transactionsResponse.totalPages}
          />
        )}
      </Box>
    </MainLayout>
  );
}
