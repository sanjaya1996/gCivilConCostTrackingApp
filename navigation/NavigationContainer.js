import React, { useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import { NavigationActions } from "react-navigation";
import * as Notifications from "expo-notifications";

import ProjectNavigator from "./AppNavigator";

const NavigationContainer = (props) => {
  const navRef = useRef();
  const isAuth = useSelector((state) => !!state.auth.token);

  useEffect(() => {
    if (!isAuth) {
      navRef.current.dispatch(
        NavigationActions.navigate({ routeName: "Auth" })
      );
    }
  }, [isAuth]);

  useEffect(() => {
    // Listeners registered by this method will be called whenever a user interacts with a notification (eg. taps on it).
    const backgroundSubscription = Notifications.addNotificationResponseReceivedListener(
      (response) => {
        const navigationData =
          response.notification.request.content.data.navigateTo;

        navRef.current.dispatch(
          NavigationActions.navigate({
            routeName: "Project",
            params: {},
            action: NavigationActions.navigate({
              routeName: "Notes",
              params: {},
              action: NavigationActions.navigate({
                routeName: "EditNote",
                params: { noteId: navigationData.noteId },
              }),
            }),
          })
        );
      }
    );
    //When an incoming notification is recieved and the app is running.
    const foregroundSubscription = Notifications.addNotificationReceivedListener(
      (notification) => {}
    );
    return () => {
      backgroundSubscription.remove();
      foregroundSubscription.remove();
    };
  }, []);

  return <ProjectNavigator ref={navRef} />;
};

export default NavigationContainer;

// import React, { useEffect, useRef } from "react";
// import { useSelector } from "react-redux";
// import { NavigationActions } from "react-navigation";
// import * as Notifications from "expo-notifications";

// import AppNavigator from "./AppNavigator";

// const NavigationContainer = (props) => {
//   const navRef = useRef();
//   const isAuth = useSelector((state) => !!state.auth.token);

//   useEffect(() => {
//     if (!isAuth) {
//       navRef.current.dispatch(
//         NavigationActions.navigate({ routeName: "Auth" })
//       );
//     }
//   }, [isAuth]);

//   return <AppNavigator ref={navRef} />;
// };

// export default NavigationContainer;
