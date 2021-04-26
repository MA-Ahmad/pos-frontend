import { ReactNode } from "react";
import {
  Box,
  Flex,
  Avatar,
  HStack,
  Link as ChakraLink,
  IconButton,
  Button,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  MenuDivider,
  useDisclosure,
  useColorModeValue,
  Stack,
  VStack,
  Image,
  Tooltip
} from "@chakra-ui/react";
import { GiHamburgerMenu } from "react-icons/gi";
import { CgNotes } from "react-icons/cg";
import { useAuthDispatch } from "../../contexts/auth";
import authenticationApi from "../../apis/authentication";
import { resetAuthTokens } from "../../apis/axios";
import { useUserState } from "../../contexts/user";
import { Link } from "react-router-dom";
import { ColorModeSwitcher } from "../../ColorModeSwitcher";
import logo from "../../assets/images/hafizDiaries.jpeg";

const Links = ["Vendors", "Profile"];

const stockLinks = ["Factory", "Cold storage", "Warehouse", "Shop"];
// const Links = ["Vendors", "Profile"];
const NavLink = props => (
  <ChakraLink
    as={Link}
    px={2}
    py={1}
    rounded={"md"}
    _hover={{
      textDecoration: "none",
      bg: useColorModeValue("gray.200", "gray.700")
    }}
    to={`/${props.link}`}
  >
    {props.link}
  </ChakraLink>
);

const Navbar = () => {
  const { user } = useUserState();
  const contact = user ? `${user.first_name} ${user.last_name}` : "user";
  const { isOpen, onOpen, onClose } = useDisclosure();
  const authDispatch = useAuthDispatch();
  const handleLogout = async () => {
    try {
      await authenticationApi.logout();
      authDispatch({ type: "LOGOUT" });
      resetAuthTokens();
      window.location.href = "/";
    } catch (error) {
      //   Toastr.error(error);
    }
  };

  return (
    <>
      <VStack bg={useColorModeValue("gray.100", "gray.900")} p={4} width={'10%'}>
        <Flex
          h={"100%"}
          alignItems={"center"}
          justifyContent={"space-between"}
          flexDirection={"column"}
        >
          <Box>
            <IconButton
              size={"md"}
              icon={isOpen ? "ttt" : <GiHamburgerMenu />}
              aria-label={"Open Menu"}
              display={{ md: !isOpen ? "none" : "inherit" }}
              onClick={isOpen ? onClose : onOpen}
            />
            <VStack spacing={4} alignItems={"center"}>
              <Box>
                <Avatar
                  src={logo}
                  size="lg"
                  name="Company Logo"
                  as={Link}
                  to="/home"
                />
              </Box>
              {/* <Box> */}
              <Menu placement="right-start">
                <Tooltip label="Stock" fontSize="md" placement="right" hasArrow closeOnClick={true}>
                  <MenuButton
                    as={Button}
                    size={"sm"}
                    variant={"link"}
                    cursor={"pointer"}
                    _hover={{ textDecoration: "none" }}
                  >
                    <IconButton
                      // as={Link}
                      // to="/stocks"
                      variant="outline"
                      colorScheme="messenger"
                      aria-label="stocks"
                      // fontSize="20px"
                      size="md"
                      icon={<CgNotes />}
                    />
                  </MenuButton>
                </Tooltip>
                <MenuList fontSize={17} zIndex={5555}>
                  {stockLinks.map(link => (
                    <MenuItem
                      as={Link}
                      to={`/stocks?type=${link.split(" ").join("_")}`}
                    >
                      {link}
                    </MenuItem>
                  ))}
                </MenuList>
              </Menu>
              {/* </Box> */}
              <VStack
                as={"nav"}
                // spacing={4}
                display={{ base: "none", md: "flex" }}
              >
                {Links.map(link => (
                  <NavLink key={link} link={link} />
                ))}
              </VStack>
              {/* <Box>
                <ColorModeSwitcher justifySelf="flex-end" />
              </Box> */}
            </VStack>
          </Box>
          <Flex alignItems={"center"}>
            <Menu>
              <MenuButton
                as={Button}
                size={"sm"}
                rounded={"full"}
                variant={"link"}
                cursor={"pointer"}
                _hover={{ textDecoration: "none" }}
              >
                <Avatar size={"sm"} name={contact} />
              </MenuButton>
              <MenuList fontSize={17} zIndex={5555}>
                <MenuItem as={Link} to="/profile">
                  My profile
                </MenuItem>
                <MenuItem as={Link} to="/account/edit">
                  Change password
                </MenuItem>
                <MenuItem onClick={handleLogout}>Logout</MenuItem>
              </MenuList>
            </Menu>
          </Flex>
        </Flex>
        {isOpen ? (
          <Box pb={4}>
            <VStack as={"nav"} spacing={4}>
              {Links.map(link => (
                <NavLink key={link} link={link} />
              ))}
            </VStack>
          </Box>
        ) : null}
      </VStack>
    </>
  );
};

export default Navbar;
