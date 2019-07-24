/* eslint-disable comma-dangle */
/* eslint-disable quotes */
import { createStackNavigator, createAppContainer } from "react-navigation";
import RootPage from "./src/root/RootPage";
import XLBannerPage from "./src/page/XLBannerPage";

const MainNavigator = createStackNavigator({
  rootPage: { screen: RootPage },
  bannerPage: { screen: XLBannerPage }
});

const App = createAppContainer(MainNavigator);

export default App;
