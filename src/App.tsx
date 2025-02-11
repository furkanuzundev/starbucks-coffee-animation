import React, { useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ImageBackground,
  StatusBar,
  Dimensions,
  ImageSourcePropType,
  TouchableOpacity,
} from "react-native";
import { registerRootComponent } from "expo";
import Animated, {
  useAnimatedScrollHandler,
  useSharedValue,
  useAnimatedStyle,
  interpolate,
  SharedValue,
  runOnJS,
  useAnimatedRef,
  SlideInDown,
  SlideInUp,
  FadeInDown,
  FadeInUp,
  FadeIn,
} from "react-native-reanimated";
import { BlurView } from "expo-blur";
import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import { typography } from "./constants/fonts";
import { COLORS } from "./constants/colors";
import { LinearGradient } from "expo-linear-gradient";

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");
const CARD_WIDTH = SCREEN_WIDTH * 0.7;
const SPACING = 0;
const CONTENT_HEIGHT = 400;
const CONTENT_INNER_HEIGHT = 300;

const drinks = [
  {
    id: 1,
    image: require("./assets/images/coffee1.png"),
    name: "Strawberry Cheesecake Frappuccino",

    price: 28,
    size: "420ml",
    description:
      "A dreamy combination of rich strawberry puree and crushed graham crackers, topped with whipped cream and a drizzle of strawberry sauce.",
  },
  {
    id: 2,
    image: require("./assets/images/coffee2.png"),
    name: "Matcha Green Tea Frappuccino",
    price: 22,
    size: "276ml",
    description:
      "A refreshing and smooth blend of premium matcha green tea, creamy milk, and ice, finished with a swirl of whipped cream and a sprinkle of matcha powder.",
  },
  {
    id: 3,
    image: require("./assets/images/coffee3.png"),
    name: "Mocha Chocolate Chip Frappuccino",
    price: 18,
    size: "391ml",
    description:
      "A delightful blend of rich mocha, chocolate chips, and creamy milk, topped with whipped cream and drizzled with luscious chocolate syrup.",
  },
];

const DrinkCard = ({
  index,
  scrollX,
  image,
}: {
  index: number;
  scrollX: SharedValue<number>;
  image: ImageSourcePropType;
}) => {
  const blurRadius = useSharedValue(0);
  const animatedStyle = useAnimatedStyle(() => {
    // Calculate the position relative to the card's index
    const position = (scrollX.value - index * CARD_WIDTH) / CARD_WIDTH;

    // Create a safe input range that won't cause crashes
    const inputRange = [-1, 0, 1];

    const scale = interpolate(position, inputRange, [0.5, 1.1, 0.5], "clamp");

    const opacity = interpolate(position, inputRange, [0.5, 1, 0.5], "clamp");

    const translateX = interpolate(
      position,
      inputRange,
      [-CARD_WIDTH * 0.6, 0, CARD_WIDTH * 0.6],
      "clamp"
    );

    const translateY = interpolate(
      position,
      inputRange,
      [-CARD_WIDTH * 0.6, 0, -CARD_WIDTH * 0.6],
      "clamp"
    );

    return {
      transform: [{ scale }, { translateX }, { translateY }],
      opacity,
    };
  });

  return (
    <Animated.View style={[styles.cardContainer, animatedStyle]}>
      <Animated.Image source={image} style={styles.drinkImage} />
    </Animated.View>
  );
};

const ContentCard = ({ drink }: { drink: (typeof drinks)[0] }) => {
  return (
    <View style={styles.contentCardInner}>
      <View style={styles.contentCardHeader}>
        <Text style={styles.priceText}>
          <Text style={styles.currencyText}>$</Text>
          {drink.price}
        </Text>
        <View style={styles.sizeContainer}>
          <Text style={styles.sizeText}>{drink.size}</Text>
        </View>
      </View>
      <Text style={styles.drinkName}>{drink.name}</Text>
      <Text style={styles.drinkDescription}>{drink.description}</Text>
    </View>
  );
};

// Keep the splash screen visible while we fetch resources
SplashScreen.preventAutoHideAsync();

export default function App() {
  const [fontsLoaded] = useFonts({
    "SoDoSans-Thin": require("./assets/fonts/SoDoSans-Thin.ttf"),
    "SoDoSans-Light": require("./assets/fonts/SoDoSans-Light.ttf"),
    "SoDoSans-Regular": require("./assets/fonts/SoDoSans-Regular.ttf"),
    "SoDoSans-SemiBold": require("./assets/fonts/SoDoSans-SemiBold.ttf"),
    "SoDoSans-Bold": require("./assets/fonts/SoDoSans-Bold.ttf"),
  });

  const scrollX = useSharedValue(0);
  const [currentIndex, setCurrentIndex] = React.useState(0);
  const contentScrollViewRef = useAnimatedRef<Animated.ScrollView>();

  useEffect(() => {
    contentScrollViewRef.current?.scrollTo({
      y: currentIndex * CONTENT_INNER_HEIGHT,
      animated: true,
    });
  }, [currentIndex]);

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollX.value = event.contentOffset.x;
      // Update current index based on scroll position
      const index = Math.round(event.contentOffset.x / CARD_WIDTH);
      // We need to use runOnJS since we're updating React state from a worklet
      runOnJS(setCurrentIndex)(index);
    },
  });

  useEffect(() => {
    const hideSplash = async () => {
      if (fontsLoaded) {
        await SplashScreen.hideAsync();
      }
    };
    hideSplash();
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    return null;
  }

  return (
    <ImageBackground
      source={require("./assets/images/background.png")}
      style={styles.background}
    >
      <StatusBar barStyle="light-content" />
      <View style={styles.container}>
        <View style={styles.logoContainer}>
          <Animated.Image
            entering={SlideInUp.duration(1000).delay(300)}
            source={require("./assets/images/logo.png")}
            style={styles.logo}
          />
        </View>
        <Animated.View
          style={styles.contentCard}
          entering={SlideInDown.duration(1000).delay(300)}
        >
          <Animated.ScrollView
            ref={contentScrollViewRef}
            showsVerticalScrollIndicator={false}
          >
            {drinks.map((drink, index) => (
              <ContentCard key={drink.id} drink={drink} />
            ))}
          </Animated.ScrollView>
          <TouchableOpacity style={styles.button}>
            <Text style={styles.buttonText}>Get it</Text>
          </TouchableOpacity>
        </Animated.View>
        <Animated.ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          snapToInterval={CARD_WIDTH}
          decelerationRate="fast"
          scrollEventThrottle={16}
          onScroll={scrollHandler}
          contentContainerStyle={styles.scrollContent}
          entering={FadeIn.duration(1000).delay(1000)}
        >
          {drinks.map((drink, index) => (
            <DrinkCard
              key={drink.id}
              index={index}
              scrollX={scrollX}
              image={drink.image}
              currentIndex={currentIndex}
            />
          ))}
        </Animated.ScrollView>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    width: "100%",
    height: "100%",
  },
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: (SCREEN_WIDTH - CARD_WIDTH) / 2,
    height: SCREEN_HEIGHT * 0.85,
    alignSelf: "flex-end",
  },
  cardContainer: {
    width: CARD_WIDTH,
    marginHorizontal: SPACING / 2,
    alignItems: "center",
    justifyContent: "center",
    height: SCREEN_WIDTH,
    overflow: "visible",
    zIndex: 1,
  },
  drinkImage: {
    width: CARD_WIDTH * 0.8,
    height: CARD_WIDTH * 1.1,
    resizeMode: "contain",
  },
  contentCard: {
    backgroundColor: COLORS.white,
    width: "80%",
    height: CONTENT_HEIGHT,
    borderRadius: 30,
    alignSelf: "center",
    padding: 20,
    paddingTop: 80,
    position: "absolute",
    zIndex: 0,
    bottom: 50,
    boxShadow: "0px 22px 70px 4px rgba(0, 0, 0, 0.56)",
    borderWidth: 1,
    borderColor: COLORS.darkGray,
  },
  contentCardInner: {
    gap: 10,
    height: CONTENT_INNER_HEIGHT,
  },
  contentCardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  priceText: {
    ...typography.h2,
  },
  currencyText: {
    ...typography.h3,
    fontSize: 13,
  },
  sizeContainer: {
    padding: 6,
    paddingHorizontal: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: COLORS.lightGray,
  },
  sizeText: {
    ...typography.h4,
    fontSize: 13,
    color: COLORS.darkGray,
  },
  drinkName: {
    ...typography.h3,
    marginBottom: 8,
  },
  drinkDescription: {
    ...typography.body2,
    color: COLORS.gray,
  },
  button: {
    backgroundColor: COLORS.black,
    padding: 12,
    borderRadius: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonText: {
    ...typography.body1,
    color: COLORS.white,
  },
  logoContainer: {
    position: "absolute",
    alignSelf: "center",
    width: 230,
    justifyContent: "center",
    alignItems: "center",
    paddingTop: 50,
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
  },
  logo: {
    width: 90,
    height: 90,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.29,
    shadowRadius: 4.65,

    elevation: 7,
  },
});

registerRootComponent(App);
