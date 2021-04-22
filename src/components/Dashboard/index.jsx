import React from "react";
import { Route, Redirect, Switch } from "react-router-dom";
import { Box, Flex } from '@chakra-ui/react'
import Navbar from "../Common/Navbar";
import MainSection from "./MainSection";
import Stocks from "./stocks/index";
import Profile from "./Account/Profile";
import AccountEdit from "./Account/AccountEdit";
import { PageSlideFade } from "../../animations/page-transitions";

const Home = () => {
  return (
    <PageSlideFade>
      <Flex width={'100%'} height={'100vh'} maxHeight={'100vh'}>
        <Navbar />
        <Box width={'100%'} >
          <Switch>
            <Route exact path="/stocks" component={Stocks} />
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
