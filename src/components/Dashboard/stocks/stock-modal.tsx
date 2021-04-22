import * as React from "react";
import {
  Button,
  ModalContent,
  Modal,
  ModalBody,
  ModalOverlay,
  ModalFooter,
  ModalHeader,
  ModalCloseButton,
  FormControl,
  FormLabel,
  Input,
  Textarea,
  Select,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  FormErrorMessage,
  Box,
  Stack
} from "@chakra-ui/react";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import { products, vendors } from "../../../data/stocks-data";

export interface StockModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedStock?: stock;
  handleStockCreate?: (stock: stock) => void;
  handleStockUpdate?: (stock: stock) => void;
}

const StockModal: React.SFC<StockModalProps> = ({
  isOpen,
  onClose,
  selectedStock,
  handleStockCreate,
  handleStockUpdate
}) => {
  const [initialValues, setInitialValues] = React.useState({
    vendor: "",
    product: "",
    quantity: "1.0"
  });
  const vendorRef = React.useRef<HTMLInputElement>(null);
  const productRef = React.useRef<HTMLInputElement>(null);
  const quantityRef = React.useRef<HTMLInputElement>(null);
  const [vendor, setVendor] = React.useState("");
  const [product, setProduct] = React.useState("");
  const [quantity, setQuantity] = React.useState("1.0");

  React.useEffect(() => {
    if (selectedStock) {
      let stock: stock = {
        id: selectedStock.id,
        vendor: selectedStock.vendor,
        product: selectedStock.product,
        quantity: selectedStock.quantity
      };
      setInitialValues(stock);
      // setVendor(selectedStock.vendor);
      // setProduct(selectedStock.product);
      setQuantity(selectedStock.quantity);
    } else {
      let stock: stock = {
        id: '',
        vendor: '',
        product: '',
        quantity: '1.0'
      };
      setInitialValues(stock);
      // setVendor("");
      // setProduct("");
      setQuantity("1.0");
    }
  }, [isOpen]);

  const handleVendorChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setVendor(event.target.value);
  };

  const handleStockChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setProduct(event.target.value);
  };

  const handleQuantityChange = value => {
    setQuantity(value);
  };

  // const handleSave = (event: React.MouseEvent<HTMLButtonElement>) => {
  //   let newStock: stock = {
  //     id: "",
  //     vendor: vendor,
  //     product: product,
  //     quantity: quantity
  //   };
  //   if (selectedStock) {
  //     newStock.id = selectedStock ? selectedStock.id : "";
  //     handleStockUpdate(newStock);
  //   } else {
  //     newStock.id = "1";
  //     handleStockCreate(newStock);
  //   }
  //   setVendor("");
  //   setProduct("");
  //   setQuantity("");
  //   onClose();
  // };

  const handleSave = (values: stock) => {
    let newStock: stock = {
      id: "",
      vendor: values.vendor,
      product: values.product,
      quantity: quantity
    };
    if (selectedStock) {
      newStock.id = selectedStock ? selectedStock.id : "";
      handleStockUpdate(newStock);
    } else {
      newStock.id = "1";
      handleStockCreate(newStock);
    }
    onClose();
  };

  const validationSchema = Yup.object({
    vendor: Yup.string().required("Vendor is required"),
    product: Yup.string().required("Product is required")
  });

  return (
    <Modal
      initialFocusRef={vendorRef}
      finalFocusRef={productRef}
      isOpen={isOpen}
      onClose={onClose}
      isCentered
      motionPreset="slideInBottom"
    >
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>{selectedStock ? "Edit" : "Create"} a Stock</ModalHeader>
        <ModalCloseButton />
        <Formik
          enableReinitialize
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={values => {
            console.log(values);
            handleSave(values);
            // handleSubmit(values);
          }}
        >
          {({
            errors,
            touched,
            values,
            handleChange,
            handleSubmit,
            isSubmitting
          }) => (
            <Form>
              <ModalBody pb={6}>
                {/* <FormControl>
            <FormLabel>Vendor</FormLabel>
            <Select
              placeholder="Select a vendor"
              value={vendor}
              onChange={event => handleVendorChange(event)}
            >
              {vendors.map(vendor => (
                <option value={vendor} key={vendor}>
                  {vendor}
                </option>
              ))}
            </Select>
          </FormControl> */}
                <Stack spacing={4}>
                  <Box>
                    <Field name="vendor" width={"100%"}>
                      {({ field, form }) => (
                        <FormControl
                          isInvalid={form.errors.vendor && form.touched.vendor}
                        >
                          <FormLabel htmlFor="vendor">Vendor</FormLabel>
                          <Select
                            {...field}
                            id="vendor"
                            placeholder="Select a vendor"
                            // value={vendor}
                            // onChange={event => handleVendorChange(event)}
                            value={values.vendor}
                            onChange={handleChange}
                          >
                            {vendors.map(vendor => (
                              <option value={vendor} key={vendor}>
                                {vendor}
                              </option>
                            ))}
                          </Select>
                          <FormErrorMessage mt={0}>
                            {form.errors.vendor}
                          </FormErrorMessage>
                        </FormControl>
                      )}
                    </Field>
                  </Box>
                  {/* <FormControl mt={4}>
                  <FormLabel>Product</FormLabel>
                  <Select
                    placeholder="Select a product"
                    value={product}
                    onChange={event => handleStockChange(event)}
                  >
                    {products.map(product => (
                      <option value={product} key={product}>
                        {product}
                      </option>
                    ))}
                  </Select>
                </FormControl> */}
                  <Box>
                    <Field name="product" width={"100%"}>
                      {({ field, form }) => (
                        <FormControl
                          isInvalid={
                            form.errors.product && form.touched.product
                          }
                        >
                          <FormLabel htmlFor="product">product</FormLabel>
                          <Select
                            {...field}
                            id="product"
                            placeholder="Select a product"
                            value={values.product}
                            onChange={handleChange}
                          >
                            {products.map(product => (
                              <option value={product} key={product}>
                                {product}
                              </option>
                            ))}
                          </Select>
                          <FormErrorMessage mt={0}>
                            {form.errors.product}
                          </FormErrorMessage>
                        </FormControl>
                      )}
                    </Field>
                  </Box>
                  <Box>
                    <FormControl>
                      <FormLabel>Quantity(kg)</FormLabel>
                      <NumberInput
                        min={1}
                        max={100}
                        defaultValue={quantity}
                        clampValueOnBlur={false}
                        step={0.2}
                        onChange={value => handleQuantityChange(value)}
                      >
                        <NumberInputField />
                        <NumberInputStepper>
                          <NumberIncrementStepper />
                          <NumberDecrementStepper />
                        </NumberInputStepper>
                      </NumberInput>
                    </FormControl>
                  </Box>
                </Stack>
              </ModalBody>
              <ModalFooter>
                <Button colorScheme="blue" mr={3} type="submit">
                  {selectedStock ? "Update" : "Create"}
                </Button>
                <Button onClick={onClose}>Cancel</Button>
              </ModalFooter>
            </Form>
          )}
        </Formik>
      </ModalContent>
    </Modal>
  );
};

export default StockModal;
