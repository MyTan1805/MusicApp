// File: app/(tabs)/_layout.tsx

import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { Tabs } from 'expo-router';
import { HeartIcon, HomeIcon, ListMusicIcon } from 'lucide-react-native';
import React from 'react';
import { Platform, Pressable, StyleSheet, View } from 'react-native';

const COLORS = { 
    active: '#A7F3D0', 
    textMuted: '#9CA3AF' 
};

export const TAB_BAR_HEIGHT = 60;
export const TAB_BAR_BOTTOM_MARGIN = Platform.OS === 'ios' ? 30 : 20;

function MyTabBar({ state, descriptors, navigation }: BottomTabBarProps) {
    return (
        <View style={styles.tabBarContainer}>
            {state.routes.map((route, index) => {
                const isFocused = state.index === index;
                
                const iconMap: { [key: string]: any } = {
                    'index': HomeIcon,
                    'favorites': HeartIcon,
                    'playlists': ListMusicIcon,
                };
                
                const IconComponent = iconMap[route.name];

                if (!IconComponent) {
                    return null;
                }

                const onPress = () => {
                    const event = navigation.emit({
                        type: 'tabPress',
                        target: route.key,
                        canPreventDefault: true,
                    });

                    if (!isFocused && !event.defaultPrevented) {
                        navigation.navigate(route.name, route.params);
                    }
                };

                return (
                    <Pressable
                        key={route.key}
                        onPress={onPress}
                        style={styles.tabButton}
                    >
                        <IconComponent
                            color={isFocused ? COLORS.active : COLORS.textMuted}
                            size={28}
                        />
                    </Pressable>
                );
            })}
        </View>
    );
}

const styles = StyleSheet.create({
    tabBarContainer: {
        position: 'absolute',
        bottom: TAB_BAR_BOTTOM_MARGIN,
        height: TAB_BAR_HEIGHT,
        alignSelf: 'center',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#111827',
        borderRadius: 999,
        paddingHorizontal: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 5 },
        shadowOpacity: 0.2,
        shadowRadius: 5,
        elevation: 5,
    },
    tabButton: {
        padding: 12,
        marginHorizontal: 4,
    }
});

export default function TabLayout() {
  return (
    <Tabs
      tabBar={(props) => <MyTabBar {...props} />}
      screenOptions={{
        headerShown: false,
      }}
    >
      {/* CHỈ CÓ 3 MÀN HÌNH */}
      <Tabs.Screen name="index" />
      <Tabs.Screen name="favorites" />
      <Tabs.Screen name="playlists" />
    </Tabs>
  );
}