import * as React from "react";
import {
  Stack,
  Box,
  Table,
  Thead,
  Tbody,
  Tfoot,
  Tr,
  Th,
  Td,
  Button,
  useColorModeValue,
  useToast,
  Checkbox,
  Input,
  FormControl,
  FormErrorMessage,
  Flex,
  Editable,
  EditableInput,
  EditablePreview
} from "@chakra-ui/react";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import { AddIcon, DeleteIcon, Search2Icon } from "@chakra-ui/icons";
import { FiEdit, FiDelete } from "react-icons/fi";
import PageLoader from "../../Common/PageLoader";
import productsApi from "../../../apis/products";
import { useUserState } from '../../../contexts/user';

export interface ProductsProps {}

const Products: React.SFC<ProductsProps> = () => {
  const [loading, setLoading] = React.useState(true);
  const [products, setProducts] = React.useState([]);
  const [isChange, setIsChange] = React.useState(false);
  const bg = useColorModeValue("#f9f7f5", "gray.700");
  const toast = useToast();
  const [checkedProductIds, setCheckedProductIds] = React.useState([]);
  const { user } = useUserState();

  React.useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await productsApi.fetch(user.company_id);
      setProducts(response.data);
    } catch (error) {
      showToast("Something went wrong", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleSave = (values: product, id: string = "") => {
    if (id) {
      updateProduct(id, values);
    } else {
      createProduct(values);
    }
  };

  const createProduct = async values => {
    try {
      const response = await productsApi.create({
        product: {
          name: values.name,
          company_id: user.company_id,
        }
      });

      showToast("Product created successfully");
      setProducts([response.data, ...products]);
      // fetchProducts();
    } catch (error) {
      showToast("Something went wrong", "error");
    }
  };

  const updateProduct = async (id, values) => {
    try {
      await productsApi.update(id, {
        product: {
          name: values.name,
          company_id: user.company_id
        }
      });
      showToast("Product updated successfully");
      // fetchProducts();
      updateProductsState(id, values);
    } catch (error) {
      showToast("Something went wrong", "error");
      window.location.reload();
      // logger.error(err);
    }
  };

  const updateProductsState = (id, values) => {
    let index = products.findIndex(product => product.id === id);
    let product = products.filter(product => product.id === id)[0];
    product.name = values.name;
    products[index] = product;
    setProducts(products);
  };

  const handleDelete = async () => {
    try {
      // setLoading(true);
      const response = await productsApi.destroy({ ids: checkedProductIds });
      fetchProducts();
      showToast(response.data);
    } catch (error) {
      showToast("Can't delete this product", "error");
    } finally {
      // setLoading(false);
    }
  };

  const showToast = (text, status = "success") => {
    toast({
      description: text,
      status: status,
      duration: 1500,
      isClosable: true
    });
  };

  return (
    <Box width={"50%"}>
      <Flex marginBottom={3} justifyContent="space-between">
        <Formik
          enableReinitialize
          initialValues={{ name: "" }}
          validationSchema={Yup.object({
            name: Yup.string().required("Name is required").matches(/^[aA-zZ\s]+$/, "Invalid name")
          })}
          onSubmit={(values, actions) => {
            console.log(values);
            handleSave(values);
            actions.resetForm({});
            actions.setSubmitting(false);
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
              <Flex>
                <Box>
                  <Field name="name" width={"100%"}>
                    {({ field, form }) => (
                      <FormControl
                        isInvalid={form.errors.name && form.touched.name}
                      >
                        <Input
                          {...field}
                          name="name"
                          placeholder="Product name"
                          width={"15rem"}
                        />
                        <FormErrorMessage mt={0}>
                          {form.errors.name}
                        </FormErrorMessage>
                      </FormControl>
                    )}
                  </Field>
                </Box>
                <Box paddingLeft={2}>
                  <Button type="submit" isLoading={isSubmitting}>
                    Add
                  </Button>
                </Box>
              </Flex>
            </Form>
          )}
        </Formik>
        <Button
          leftIcon={<DeleteIcon />}
          variant="outline"
          colorScheme={"blue"}
          boxShadow="lg"
          size="md"
          _hover={{ boxShadow: "none" }}
          onClick={() => handleDelete()}
          isDisabled={!checkedProductIds.length}
        >
          Delete
        </Button>
      </Flex>
      <Box
        border="1px"
        borderColor="gray.200"
        rounded="md"
        maxHeight={"55vh"}
        height={"55vh"}
        overflowY="scroll"
      >
        <Table variant="simple">
          <Thead>
            <Tr>
              <Th width="10px">
                <Checkbox
                  isChecked={
                    checkedProductIds.length ===
                    products.map(product => product.id).length
                  }
                  onChange={() => {
                    const productIds = products.map(product => product.id);
                    if (checkedProductIds.length === productIds.length) {
                      setCheckedProductIds([]);
                    } else {
                      setCheckedProductIds(productIds);
                    }
                  }}
                ></Checkbox>
              </Th>
              <Th>Products</Th>
              {/* <Th width="10px"></Th> */}
            </Tr>
          </Thead>
          <Tbody>
            {products.map((product, index) => (
              <Tr
                key={product.id}
                _hover={{ bg: bg }}
                _groupHover={{ bg: bg }}
                cursor="pointer"
                // onClick={() => handleClick(product.id)}
              >
                <Td width="10px">
                  <Checkbox
                    isChecked={checkedProductIds.includes(product.id)}
                    onChange={event => {
                      event.stopPropagation();
                      const index = checkedProductIds.indexOf(product.id);

                      if (index > -1) {
                        setCheckedProductIds([
                          ...checkedProductIds.slice(0, index),
                          ...checkedProductIds.slice(index + 1)
                        ]);
                      } else {
                        setCheckedProductIds([
                          ...checkedProductIds,
                          product.id
                        ]);
                      }
                    }}
                  ></Checkbox>
                </Td>
                {/* <Td>{product.name}</Td> */}
                <Td>
                  <Editable
                    defaultValue={product.name}
                    onChange={value => {
                      console.log(value);
                      setIsChange(true);
                    }}
                    onSubmit={value => {
                      if (isChange) {
                        handleSave({ name: value }, product.id);
                        setIsChange(false);
                      }
                      if (!value.length) window.location.reload();
                    }}
                    submitOnBlur={false}
                  >
                    <EditablePreview />
                    <EditableInput />
                  </Editable>
                </Td>
                {/* <Td width="10px">
                  <HStack spacing={3}>
                    <Tooltip
                      label="Edit"
                      fontSize="md"
                      placement="top"
                      hasArrow
                      closeOnClick={true}
                    >
                      <IconButton
                        variant="outline"
                        colorScheme="messenger"
                        aria-label="stocks"
                        size="sm"
                        icon={<FiEdit />}
                      />
                    </Tooltip>
                  </HStack>
                </Td> */}
              </Tr>
            ))}
          </Tbody>
        </Table>
      </Box>
    </Box>
  );
};

export default Products;
