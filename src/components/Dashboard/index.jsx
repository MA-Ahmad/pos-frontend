import React from "react";
import { Route, Redirect, Switch } from "react-router-dom";
import { Box, Flex } from '@chakra-ui/react'
import Navbar from "../Common/Navbar";
import MainSection from "./MainSection";
import Stocks from "./stocks/index";
import Profile from "./Account/Profile";
import AccountEdit from "./Account/AccountEdit";
import { PageSlideFade } from "../../animations/page-transitions";
import Vendors from "./vendors/index";

const useQuery = () => {
  let obj = new URL(window.location.href)
  if (obj.href.includes('type=')) {
    let url_array = obj.href.split('type=')
    return url_array[url_array.length - 1]
  }
}

const Home = ({ history }) => {
  let query = useQuery();

  return (
    <PageSlideFade>
      <Flex width={'100%'} height={'100vh'} maxHeight={'100vh'}>
        <Navbar />
        <Box width={'90%'} >
          <Switch>
            <Route exact path="/vendors" component={Vendors} />
            <Route exact path="/stocks" component={() => <Stocks type={query} />} />
            <Route exact path="/home" component={MainSection} />
            <Route exact path="/account/edit" component={AccountEdit} />
            <Route exact path="/profile" component={Profile} />
            <Redirect from="/" to="/home" />
          </Switch>
        </Box>
      </Flex>
    </PageSlideFade>

  );
};

export default Home;
