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
  TableCaption,
  HStack,
  Heading,
  Button,
  Divider,
  useDisclosure,
  useColorModeValue,
  useToast,
  Checkbox,
  IconButton,
  Tooltip,
  Input,
  InputGroup,
  InputLeftElement
} from "@chakra-ui/react";
import { AddIcon, DeleteIcon, Search2Icon } from "@chakra-ui/icons";
import StockModal from "./stock-modal";
import { PageSlideFade } from "../../../animations/page-transitions";
import { FiEdit, FiDelete } from "react-icons/fi";
import PageLoader from "../../Common/PageLoader";
import stocksApi from "../../../apis/stocks";

const stocks = [
  {
    id: "Odork5n5jPVd0wvm0w_dY",
    vendor: "Kfc",
    product: "Chae",
    quantity: "15"
  },
  {
    id: "Odsfdork5n5jPVd0wvm0w_dY",
    vendor: "RohAfza",
    product: "Chae",
    quantity: "9"
  },
  {
    id: "Odorkeee5n5jPVd0wvm0w_dY",
    vendor: "Title",
    product: "Kofee",
    quantity: "13"
  },
  {
    id: "Odork5n5dfjPVd0wvm0w_dY",
    vendor: "Vitol",
    product: "Doodh",
    quantity: "5"
  }
];

export default function Stocks() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [loading, setLoading] = React.useState(true);
  const [stockList, setStockList] = React.useState([]);
  const [selectedStock, setSelectedStock] = React.useState<stock>(null);
  const bg = useColorModeValue("#f9f7f5", "gray.700");
  const toast = useToast();

  const [checkedStockIds, setCheckedStockIds] = React.useState([]);
  const [checkedItems, setCheckedItems] = React.useState([]);
  const allChecked = checkedItems.every(Boolean);
  const isIndeterminate = checkedItems.some(Boolean) && !allChecked;
  const someChecked = checkedItems.some(Boolean);

  React.useEffect(() => {
    fetchStocks();
  }, []);

  const fetchStocks = async () => {
    try {
      setLoading(true);
      const response = await stocksApi.fetch();
      console.log(response)
      let checkedList = [];
      response.data.map(stock => checkedList.push(false));
      setCheckedItems(checkedList);
      setStockList(response.data);
    } catch (error) {
      //   logger.error(error);
    } finally {
      setLoading(false);
    }
  };

  //   React.useEffect(() => {
  //     let checkedList = [];
  //     stocks.map(stock => checkedList.push(false));
  //     setCheckedItems(checkedList);
  //     setStockList(stocks);
  //   }, []);

  const handleStockCreate = (stock: stock) => {
    const newStocksState: stock[] = [...stockList];
    newStocksState.push(stock);
    setStockList(newStocksState);
    showToast("Stock created successfully");
  };

  const handleStockUpdate = (newStock: stock) => {
    const newStockList: stock[] = [...stockList];
    const index = stockList.findIndex(
      (stock: stock) => stock.id === newStock.id
    );
    newStockList[index] = newStock;
    setStockList(newStockList);
    showToast("Stock updated successfully");
  };

  const handleClick = (id: string) => {
    const selectedStock = stockList.find((stock: stock) => stock.id === id);
    setSelectedStock(selectedStock);
    onOpen();
  };

  const handleCreateClick = () => {
    setSelectedStock(null);
    onOpen();
  };

  const showToast = text => {
    toast({
      description: text,
      status: "success",
      duration: 1500,
      isClosable: true
    });
  };

  const handleChildCheck = index => {
    console.log(isIndeterminate);

    let checkedArray = [...checkedItems];
    checkedArray[index] = !checkedItems[index];
    setCheckedItems(checkedArray);
  };

  const handleParentCheck = () => {
    console.log(isIndeterminate);
    let checkedArray = [];
    if (allChecked) checkedItems.map(item => checkedArray.push(false));
    else checkedItems.map(item => checkedArray.push(true));
    setCheckedItems(checkedArray);
  };

  //   const handleDelete = (id: string) => {
  //     const newStockList: stock[] = stockList.filter(
  //       (stock: stock) => stock.id !== id
  //     );
  //     setStockList(newStockList);
  //     showToast("Stock deleted successfully");
  //   };

  const handleDelete = async () => {
    try {
      setLoading(true);
      const response = await stocksApi.destroy({ ids: checkedStockIds });
      onClose();
      fetchStocks();
      showToast(response.data);
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };

  const handleMultipleDelete = () => {
    if (allChecked) setStockList([]);
    else {
      let indexArray = [];
      let unCheckedArray = [];
      checkedItems.map((item, index) => {
        if (item) indexArray.push(index);
        else unCheckedArray.push(item);
      });
      const newStockList: stock[] = stockList.filter(
        (stock: stock, index: number) => indexArray.indexOf(index) === -1
      );
      setCheckedItems(unCheckedArray);
      setStockList(newStockList);
    }
    showToast("Selected stock deleted successfully");
  };

  if (loading) {
    return <PageLoader />;
  }

  return (
    <PageSlideFade>
      <Stack>
        <HStack justify={"space-between"} p={5}>
          <Box>
            <Heading fontSize={"xl"}>Stock</Heading>
          </Box>
          <Box>
            <Button
              leftIcon={<AddIcon />}
              colorScheme={"blue"}
              boxShadow="lg"
              _hover={{ boxShadow: "none" }}
              variant="solid"
              size="sm"
              onClick={() => handleCreateClick()}
            >
              Add new stock
            </Button>
          </Box>
        </HStack>
        <HStack justify={"space-between"} px={5} py={2}>
          <InputGroup size="sm">
            <InputLeftElement
              pointerEvents="none"
              children={<Search2Icon color="gray.300" />}
            />
            <Input
              type="text"
              w={"15em"}
              borderRadius="5px"
              placeholder="Search"
            />
          </InputGroup>
          <Button
            leftIcon={<DeleteIcon />}
            variant="outline"
            colorScheme={"blue"}
            boxShadow="lg"
            size="sm"
            _hover={{ boxShadow: "none" }}
            onClick={() => handleDelete()}
            // isDisabled={!someChecked}
            isDisabled={!checkedStockIds.length}
          >
            Delete
          </Button>
        </HStack>
        <Divider />
        <Box p={5}>
          <Box
            border="1px"
            borderColor="gray.200"
            rounded="md"
            maxHeight={"71vh"}
            overflowY="scroll"
          >
            <Table variant="simple">
              {/* <TableCaption mt={0} placement="top">
                <Heading fontSize={"md"}>Stock Data</Heading>
              </TableCaption> */}
              <Thead>
                <Tr>
                  <Th width="10px">
                    <Checkbox
                      //   isChecked={allChecked}
                      //   isIndeterminate={isIndeterminate}
                      //   onChange={e => handleParentCheck()}
                      isChecked={
                        checkedStockIds.length ===
                        stockList.map(stock => stock.id).length
                      }
                      onChange={() => {
                        const stockIds = stockList.map(stock => stock.id);
                        if (checkedStockIds.length === stockIds.length) {
                          setCheckedStockIds([]);
                        } else {
                          setCheckedStockIds(stockIds);
                        }
                      }}
                    ></Checkbox>
                  </Th>
                  <Th>Vendor</Th>
                  <Th>Product</Th>
                  <Th>Quantity(kg)</Th>
                  <Th>Price(per kg)</Th>
                  <Th>Total</Th>
                  <Th width="10px"></Th>
                </Tr>
              </Thead>
              <Tbody>
                {stockList.map((stock, index) => (
                  <Tr
                    key={stock.id}
                    _hover={{ bg: bg }}
                    _groupHover={{ bg: bg }}
                    cursor="pointer"
                    // onClick={() => handleClick(stock.id)}
                  >
                    <Td width="10px">
                      <Checkbox
                        // isChecked={checkedItems[index]}
                        // onChange={e => handleChildCheck(index)}
                        isChecked={checkedStockIds.includes(stock.id)}
                        onChange={event => {
                          event.stopPropagation();
                          const index = checkedStockIds.indexOf(stock.id);

                          if (index > -1) {
                            setCheckedStockIds([
                              ...checkedStockIds.slice(0, index),
                              ...checkedStockIds.slice(index + 1)
                            ]);
                          } else {
                            setCheckedStockIds([...checkedStockIds, stock.id]);
                          }
                        }}
                      ></Checkbox>
                    </Td>
                    <Td>{stock.vendor ? stock.vendor.name : ""}</Td>
                    <Td>{stock.product ? stock.product.name : ""}</Td>
                    <Td>{stock.quantity}</Td>
                    <Td>{stock.price}</Td>
                    <Td>{(stock.price * stock.quantity).toFixed(2)}</Td>
                    <Td width="10px">
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
                            onClick={() => handleClick(stock.id)}
                          />
                        </Tooltip>
                        {/* <Tooltip
                          label="Delete"
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
                            icon={<FiDelete />}
                            onClick={() => handleDelete(stock.id)}
                          />
                        </Tooltip> */}
                      </HStack>
                    </Td>
                  </Tr>
                ))}
              </Tbody>
              {/* <Tfoot>
                <Tr>
                  <Th>To convert</Th>
                  <Th>into</Th>
                  <Th>multiply by</Th>
                </Tr>
              </Tfoot> */}
            </Table>
          </Box>
        </Box>
      </Stack>
      <StockModal
        isOpen={isOpen}
        onClose={onClose}
        selectedStock={selectedStock}
        handleStockCreate={handleStockCreate}
        handleStockUpdate={handleStockUpdate}
        refetch={fetchStocks}
      />
    </PageSlideFade>
  );
}
