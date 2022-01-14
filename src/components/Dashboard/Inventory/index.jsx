import * as React from "react";
import {
    Stack,
    Box,
    HStack,
    VStack,
    Heading,
    Button,
    Divider,
    Flex,
    useDisclosure,
    useColorModeValue,
    useToast,
    Text,
    Input,
    InputGroup,
    InputLeftElement,
    FormControl,
    FormErrorMessage,
    Table,
    Thead,
    Tbody,
    Tr,
    Th,
    Td,
    Checkbox,
    NumberInput,
    NumberInputField,
    NumberIncrementStepper,
    NumberDecrementStepper,
    NumberInputStepper
} from "@chakra-ui/react";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import { AddIcon, DeleteIcon, Search2Icon, PlusSquareIcon, CheckCircleIcon } from "@chakra-ui/icons";
import { PageSlideFade } from "../../../animations/page-transitions";
import PageLoader from "../../Common/PageLoader";
import { useUserState } from '../../../contexts/user';
import productsApi from "../../../apis/products";
import transactionsApi from "../../../apis/transactions";


export default function Inventory({ type }) {
    const [loading, setLoading] = React.useState(false);
    const [checkedProductIds, setCheckedProductIds] = React.useState([]);
    const [products, setProducts] = React.useState([]);
    const bg = useColorModeValue("#f9f7f5", "gray.700");
    const toast = useToast();
    const { user } = useUserState();


    // React.useEffect(() => {
    //     fetchProducts();
    // }, []);

    // const fetchProducts = async () => {
    //     try {
    //         setLoading(true);
    //         const response = await productsApi.fetch(user.company_id);
    //         setProducts(response.data);
    //     } catch (error) {
    //         showToast("Something went wrong", "error");
    //     } finally {
    //         setLoading(false);
    //     }
    // };

    const fetchProduct = async (sku) => {
        try {
            const response = await productsApi.getSingle(sku);
            if (response.data) {
                if (products.filter((p) => p.id === response.data.id)[0]) {
                    showToast("Product already added", "error");
                    return;
                }
                response.data["quantity"] = 1
                setProducts([...products, ...[response.data]])
            }
        } catch (error) {
            showToast("Product not found", "error");
        }
    };

    const handleChangeQuantity = (id, value) => {
        let product = products.filter((p) => p.id === id)[0];
        product.quantity = value;
        const state_products = [...products];
        const index = products.findIndex(product => product.id === id);
        state_products[index] = product;
        setProducts(state_products)
    }

    const handleDelete = (id) => {
        setProducts(products.filter((p) => p.id !== id))
    }

    const handleSubmit = (event) => {
        event.preventDefault();
        let obj = {};
        // let node_list = event.target.elements.quantity;
        // for (let i = 0; i < node_list.length; i++) {
        //     obj[node_list[i].name] = Number(node_list[i].value);
        // }
        products.map((p) => obj[p.id] = p.quantity)
        createTransaction(obj);
    }

    const createTransaction = async products => {
        try {
            const response = await transactionsApi.create({
                transaction: {
                    products,
                    company_id: user.company_id
                }
            });
            showToast(response.data.message, response.data.status === 400 ? 'error' : 'success');
        } catch (error) {
            debugger
            showToast("Something went wrong", "error");
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

    // const products = [{
    //     id: 1,
    //     name: 'abc', quantity: 2, price: 500, total: 1000
    // },
    // {
    //     id: 2,
    //     name: 'abcd', quantity: 4, price: 500, total: 1000
    // }]

    if (loading) {
        return <PageLoader />;
    }

    return (
        <PageSlideFade>
            <Stack>
                <HStack justify={"space-between"} p={5}>
                    <Box>
                        <Heading fontSize={"xl"}>Inventory</Heading>
                    </Box>
                </HStack>
                <Divider />

                <Box p={5}>
                    <HStack width={"100%"}>
                        <Box width={"100%"}>
                            <Flex marginBottom={3} justifyContent="space-between" alignItems="center">
                                <Formik
                                    enableReinitialize
                                    initialValues={{ sku: "" }}
                                    validationSchema={Yup.object({
                                        sku: Yup.string().required("Sku is required")
                                    })}
                                    onSubmit={(values, actions) => {
                                        console.log(values);
                                        fetchProduct(values.sku);
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
                                                    <Field name="sku" width={"100%"}>
                                                        {({ field, form }) => (
                                                            <FormControl
                                                                isInvalid={
                                                                    form.errors.sku && form.touched.sku
                                                                }
                                                            >
                                                                <Input
                                                                    {...field}
                                                                    name="sku"
                                                                    placeholder="Product SKU"
                                                                    width={"15rem"}
                                                                />
                                                                <FormErrorMessage mt={0}>
                                                                    {form.errors.sku}
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
                                <HStack>
                                    <Button
                                        leftIcon={<PlusSquareIcon />}
                                        variant="outline"
                                        colorScheme={"blue"}
                                        boxShadow="lg"
                                        size="sm"
                                        _hover={{ boxShadow: "none" }}
                                        onClick={() => setProducts([])}
                                    >
                                        New transaction
                                    </Button>
                                </HStack>
                            </Flex>
                        </Box>
                    </HStack>
                </Box>
                <Divider />

                <Box p={5}>
                    <form onSubmit={handleSubmit}>
                        <Box
                            border="1px"
                            borderColor="gray.200"
                            rounded="md"
                            maxHeight={"60vh"}
                            overflowY="scroll"
                        >
                            <Table variant="simple" size="sm">
                                <Thead>
                                    <Tr>
                                        <Th>Product Name</Th>
                                        <Th>SKU</Th>
                                        <Th>Quantity(kg)</Th>
                                        <Th>Price(per kg)</Th>
                                        <Th>Total Price</Th>
                                        <Th></Th>
                                    </Tr>
                                </Thead>
                                <Tbody>
                                    {products.map((product, index) => (
                                        <Tr
                                            key={product.id}
                                            _hover={{ bg: bg }}
                                            _groupHover={{ bg: bg }}
                                            cursor="pointer"
                                        >
                                            <Td>
                                                <Text isTruncated maxWidth={"10em"}>
                                                    {product.name}
                                                </Text>
                                            </Td>
                                            <Td>
                                                <Text isTruncated maxWidth={"10em"}>
                                                    {product.sku}
                                                </Text>
                                            </Td>
                                            <Td>
                                                <FormControl>
                                                    <NumberInput max={100} min={1} defaultValue={1} step={0.2} onChange={value => handleChangeQuantity(product.id, value)}>
                                                        <NumberInputField id='quantity' name={product.id} />
                                                        <NumberInputStepper>
                                                            <NumberIncrementStepper />
                                                            <NumberDecrementStepper />
                                                        </NumberInputStepper>
                                                    </NumberInput>
                                                </FormControl>
                                            </Td>
                                            <Td>{product.price}</Td>
                                            <Td>{(product.price * product.quantity)?.toFixed(2)}</Td>
                                            <Td>
                                                <Button
                                                    leftIcon={<DeleteIcon />}
                                                    variant="outline"
                                                    colorScheme={"blue"}
                                                    boxShadow="lg"
                                                    size="sm"
                                                    _hover={{ boxShadow: "none" }}
                                                    onClick={() => handleDelete(product.id)}
                                                >
                                                    Delete
                                                </Button>
                                            </Td>
                                        </Tr>
                                    ))}
                                </Tbody>
                            </Table>
                        </Box>
                        <Button
                            leftIcon={<CheckCircleIcon />}
                            variant="outline"
                            colorScheme={"blue"}
                            boxShadow="lg"
                            size="sm"
                            _hover={{ boxShadow: "none" }}
                            mt="2"
                            float="right"
                            type="submit"
                            isDisabled={!products.length}
                        >
                            Complete transaction
                        </Button>
                    </form>
                </Box>
                <Box> {products.length ?
                    <VStack p={4} justify="center">
                        <HStack align="center">
                            <Heading fontSize={"xl"}>Total Amount: </Heading>
                            <Text>
                                {products
                                    .map(p => p.price * p.quantity)
                                    .reduce((a, c) => {
                                        return a + c;
                                    }).toFixed(2)
                                }
                            </Text>
                        </HStack>
                        <HStack align="center">
                            <Heading fontSize={"xl"}>Total quantity (kg): </Heading>
                            <Text>
                                {products.reduce((prev, cur) => {
                                    return Math.round(prev) + Math.round(cur.quantity);
                                }, 0)
                                }
                            </Text>
                        </HStack>
                    </VStack> : ""
                }
                </Box>

            </Stack>
        </PageSlideFade>
    );
}
