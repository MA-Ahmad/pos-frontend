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
  Flex,
  HStack,
  Heading,
  Button,
  Divider,
  useColorModeValue,
  useToast,
  Checkbox,
  Input,
  FormControl,
  FormErrorMessage,
  Editable,
  EditableInput,
  EditablePreview
} from "@chakra-ui/react";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import { AddIcon, DeleteIcon, Search2Icon } from "@chakra-ui/icons";
import { PageSlideFade } from "../../../animations/page-transitions";
import { FiEdit, FiDelete } from "react-icons/fi";
import PageLoader from "../../Common/PageLoader";
import Products from "../products/index";
import vendorsApi from "../../../apis/vendors";

export default function Vendors() {
  const [loading, setLoading] = React.useState(true);
  const [vendors, setVendors] = React.useState([]);
  const [isChange, setIsChange] = React.useState(false);
  const bg = useColorModeValue("#f9f7f5", "gray.700");
  const toast = useToast();
  const [checkedVendorIds, setCheckedVendorIds] = React.useState([]);

  React.useEffect(() => {
    fetchVendors();
  }, []);

  const fetchVendors = async () => {
    try {
      setLoading(true);
      const response = await vendorsApi.fetch();
      setVendors(response.data);
    } catch (error) {
      showToast(error.response.data.error, "error");
    } finally {
      setLoading(false);
    }
  };

  const handleSave = (values: vendor, id: string = "") => {
    if (id) {
      updateVendor(id, values);
    } else {
      createVendor(values);
    }
  };

  const createVendor = async values => {
    try {
      const response = await vendorsApi.create({
        vendor: {
          name: values.name
        }
      });
      showToast("Vendor created successfully");
      setVendors([response.data.vendor, ...vendors]);
      //   fetchVendors();
    } catch (error) {
      showToast(error.response.data.error, "error");
    }
  };

  const updateVendor = async (id, values) => {
    try {
      await vendorsApi.update(id, {
        vendor: {
          name: values.name
        }
      });
      showToast("Vendor updated successfully");
      updateVendorsState(id, values);
      //   fetchVendors();
    } catch (error) {
      showToast(error.response.data.error, "error");
      window.location.reload();
      // logger.error(err);
    }
  };

  const updateVendorsState = (id, values) => {
    let index = vendors.findIndex(vendor => vendor.id === id);
    let vendor = vendors.filter(vendor => vendor.id === id)[0];
    vendor.name = values.name;
    vendors[index] = vendor;
    setVendors(vendors);
    console.log(vendors);
  };

  const handleDelete = async () => {
    try {
      // setLoading(true);
      const response = await vendorsApi.destroy({ ids: checkedVendorIds });
      fetchVendors();
      showToast(response.data.notice);
    } catch (error) {
      showToast(error.response.data.error, "error");
      console.log(error.response.data.error);
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

  if (loading) {
    return <PageLoader />;
  }

  return (
    <PageSlideFade>
      <Stack>
        <HStack justify={"space-between"} p={5}>
          <Box>
            <Heading fontSize={"xl"}>Vendors</Heading>
          </Box>
          <Box>
            <Heading fontSize={"xl"}>Products</Heading>
          </Box>
        </HStack>
        <Divider />
        <Box p={5}>
          <HStack width={"100%"}>
            <Box width={"50%"}>
              <Flex marginBottom={3} justifyContent="space-between">
                <Formik
                  enableReinitialize
                  initialValues={{ name: "" }}
                  validationSchema={Yup.object({
                    name: Yup.string().required("Name is required")
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
                                isInvalid={
                                  form.errors.name && form.touched.name
                                }
                              >
                                <Input
                                  {...field}
                                  name="name"
                                  placeholder="Vendor name"
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
                  isDisabled={!checkedVendorIds.length}
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
                            checkedVendorIds.length ===
                            vendors.map(vendor => vendor.id).length
                          }
                          onChange={() => {
                            const vendorIds = vendors.map(vendor => vendor.id);
                            if (checkedVendorIds.length === vendorIds.length) {
                              setCheckedVendorIds([]);
                            } else {
                              setCheckedVendorIds(vendorIds);
                            }
                          }}
                        ></Checkbox>
                      </Th>
                      <Th>Vendors</Th>
                      {/* <Th width="10px"></Th> */}
                    </Tr>
                  </Thead>
                  <Tbody>
                    {vendors.map((vendor, index) => (
                      <Tr
                        key={vendor.id}
                        _hover={{ bg: bg }}
                        _groupHover={{ bg: bg }}
                        cursor="pointer"
                        // onClick={() => handleClick(vendor.id)}
                      >
                        <Td width="10px">
                          <Checkbox
                            isChecked={checkedVendorIds.includes(vendor.id)}
                            onChange={event => {
                              event.stopPropagation();
                              const index = checkedVendorIds.indexOf(vendor.id);

                              if (index > -1) {
                                setCheckedVendorIds([
                                  ...checkedVendorIds.slice(0, index),
                                  ...checkedVendorIds.slice(index + 1)
                                ]);
                              } else {
                                setCheckedVendorIds([
                                  ...checkedVendorIds,
                                  vendor.id
                                ]);
                              }
                            }}
                          ></Checkbox>
                        </Td>
                        <Td>
                          <Editable
                            defaultValue={vendor.name}
                            onChange={value => {
                              console.log(value);
                              setIsChange(true);
                            }}
                            onSubmit={value => {
                              if (isChange) {
                                handleSave({ name: value }, vendor.id);
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
            <Products />
          </HStack>
        </Box>
      </Stack>
    </PageSlideFade>
  );
}
