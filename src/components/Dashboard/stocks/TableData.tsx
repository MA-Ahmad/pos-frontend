import * as React from "react";
import {
  Stack,
  Box,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  HStack,
  useColorModeValue,
  useToast,
  Checkbox,
  IconButton,
  Tooltip,
} from "@chakra-ui/react";
import { FiEdit, FiDelete } from "react-icons/fi";
import Moment from 'react-moment';

export interface TableDataProps {
  checkedStockIds: any[];
  setCheckedStockIds: React.Dispatch<React.SetStateAction<any[]>>;
  stockList: stock[];
  handleClick: (id: string) => void;
  type: string;
}

const TableData: React.SFC<TableDataProps> = ({
  checkedStockIds,
  setCheckedStockIds,
  stockList,
  handleClick,
  type
}) => {
  const bg = useColorModeValue("#f9f7f5", "gray.700");

  return (
    <Table variant="simple">
      <Thead>
        <Tr>
          <Th width="10px">
            <Checkbox
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
          {type === "Factory" && <Th>Vendor</Th>}
          <Th>Product</Th>
          <Th>Quantity(kg)</Th>
          <Th>Price(per kg)</Th>
          <Th>Total Price</Th>
          {/* <Th>Storage</Th> */}
          <Th>Time ago</Th>
          <Th>Date</Th>
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
          >
            <Td width="10px">
              <Checkbox
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
            {type === "Factory" && (
              <Td>{stock.vendor ? stock.vendor.name : ""}</Td>
            )}
            <Td>{stock.product ? stock.product.name : ""}</Td>
            <Td>{stock.quantity}</Td>
            <Td>{stock.price}</Td>
            <Td>{(stock.price * stock.quantity)?.toFixed(2)}</Td>
            {/* <Td>{stock.type.split("Stock")[0]}</Td> */}
            <Td><Moment toNow>{stock.created_at}</Moment></Td>
            <Td><Moment format="DD/MM/YYYY">{stock.created_at}</Moment></Td>
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
              </HStack>
            </Td>
          </Tr>
        ))}
      </Tbody>
    </Table>
  );
};

export default TableData;
