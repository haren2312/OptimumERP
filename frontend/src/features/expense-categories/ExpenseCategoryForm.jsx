import React from "react";
import FormDrawerLayout from "../common/form-drawer-layout";
import {
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  Textarea,
} from "@chakra-ui/react";

export default function ExpenseCategoryForm({ formik, isOpen, onClose }) {
  return (
    <FormDrawerLayout
      formBtnLabel={formik.values._id ? "Update" : "Save"}
      formHeading={"Expense Category"}
      handleFormSubmit={formik.handleSubmit}
      isOpen={isOpen}
      onClose={onClose}
    >
      <FormControl isRequired>
        <FormLabel>Expense Type</FormLabel>
        <Input
          name="name"
          value={formik.values.name}
          onChange={formik.handleChange}
        />
        <FormErrorMessage>{formik.errors.name}</FormErrorMessage>
      </FormControl>
      <FormControl isRequired>
        <FormLabel>Description</FormLabel>
        <Textarea
          name="description"
          value={formik.values.description}
          onChange={formik.handleChange}
        />
        <FormErrorMessage>{formik.errors.description}</FormErrorMessage>
      </FormControl>
    </FormDrawerLayout>
  );
}
