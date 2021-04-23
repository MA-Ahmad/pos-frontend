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
  Stack,
  useToast
} from "@chakra-ui/react";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import { products, vendors } from "../../../data/stocks-data";
import vendorsApi from "../../../apis/vendors";
import productsApi from "../../../apis/products";
import stocksApi from "../../../apis/stocks";

export interface StockModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedStock?: stock;
  handleStockCreate?: (stock: stock) => void;
  handleStockUpdate?: (stock: stock) => void;
  refetch: () => void;
}

const StockModal: React.SFC<StockModalProps> = ({
  isOpen,
  onClose,
  selectedStock,
  handleStockCreate,
  handleStockUpdate,
  refetch
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
  const [loading, setLoading] = React.useState(true);
  const [vendors, setVendors] = React.useState([]);
  const [products, setProducts] = React.useState([]);
  const toast = useToast();

  const fetchVendors = async () => {
    try {
      setLoading(true);
      const response = await vendorsApi.fetch();
      setVendors(response.data);
    } catch (error) {
      //   logger.error(error);
    } finally {
      setLoading(false);
    }
  };

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await productsApi.fetch();
      setProducts(response.data);
    } catch (error) {
      //   logger.error(error);
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    if (!vendors.length) fetchVendors();
    if (!products.length) fetchProducts();

    if (selectedStock) {
      let stock: stock = {
        id: selectedStock.id,
        vendor: selectedStock.vendor.id,
        product: selectedStock.product.id,
        quantity: selectedStock.quantity
      };
      setInitialValues(stock);
      // setVendor(selectedStock.vendor);
      // setProduct(selectedStock.product);
      setQuantity(selectedStock.quantity);
    } else {
      let stock: stock = {
        id: "",
        vendor: "",
        product: "",
        quantity: "1.0"
      };
      setInitialValues(stock);
      setQuantity("1.0");
    }
  }, [isOpen]);

  const handleQuantityChange = value => {
    setQuantity(value);
  };

  const handleSave = (values: stock) => {
    if (selectedStock) {
      updateStock(selectedStock.id, values);
    } else {
      createStock(values);
    }
    onClose();
  };

  const createStock = async values => {
    try {
      await stocksApi.create({
        stock: {
          vendor_id: values.vendor,
          product_id: values.product,
          quantity: quantity
        }
      });
      refetch();
      onClose();
    } catch (err) {
      // logger.error(err);
    } finally {
      showToast("Stock created successfully");
    }
  };

  const updateStock = async (id, values) => {
    try {
      await stocksApi.update(id, {
        stock: {
          vendor_id: values.vendor,
          product_id: values.product,
          quantity: quantity
        }
      });
      refetch();
      onClose();
    } catch (err) {
      // logger.error(err);
    } finally {
      showToast("Stock updated successfully");
    }
  };

  const showToast = text => {
    toast({
      description: text,
      status: "success",
      duration: 1500,
      isClosable: true
    });
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
                              <option value={vendor.id} key={vendor.id}>
                                {vendor.name}
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
                              <option value={product.id} key={product.id}>
                                {product.name}
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
                <Button
                  isLoading={isSubmitting}
                  colorScheme="blue"
                  mr={3}
                  type="submit"
                >
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
