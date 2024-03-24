import { AiOutlineCustomerService, AiOutlineDashboard } from "react-icons/ai";
import { FaFileInvoice, FaFileInvoiceDollar } from "react-icons/fa6";
import { GiExpense } from "react-icons/gi";
import { GoTag } from "react-icons/go";
import { TbCategory } from "react-icons/tb";
import { FaMoneyBillTrendUp } from "react-icons/fa6";
import { HiOutlineDocumentReport } from "react-icons/hi";

const headerLinks = [
  { icon: AiOutlineDashboard, link: "/dashboard", label: "Dashboard" },
  { icon: AiOutlineCustomerService, link: "/customers", label: "Customers" },
  { icon: FaFileInvoiceDollar, link: "/invoices", label: "Invoices" },
  { icon: FaFileInvoice, link: "/estimates", label: "Quotations/Estimates" },
  { icon: GiExpense, link: "/expenses", label: "Expenses" },
  { icon: FaMoneyBillTrendUp, link: "/purchases", label: "Purchase" },
  {
    icon: TbCategory,
    link: "/categories/expense",
    label: "Categories",
  },
  {
    icon: HiOutlineDocumentReport,
    link: "/reports/sale",
    label: "Reports",
  },
  { icon: GoTag, link: "/products", label: "Items" },
];

export default headerLinks;
