// File: client-user/src/navigation/MainTabs.jsx
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { COLORS, FONT_SIZE } from '../shared/constants/theme';
import FieldsScreen from '../features/fields/screens/FieldsScreen';
import FieldDetailScreen from '../features/fields/screens/FieldDetailScreen';
import CreateReservationScreen from '../features/reservations/screens/CreateReservationScreen';
import TeamsScreen from '../features/teams/screens/TeamsScreen';
import TeamDetailScreen from '../features/teams/screens/TeamDetailScreen';
import MyTeamsScreen from '../features/teams/screens/MyTeamsScreen';
import CreateTeamScreen from '../features/teams/screens/CreateTeamScreen';
import TournamentsScreen from '../features/tournaments/screens/TournamentsScreen';
import TournamentDetailScreen from '../features/tournaments/screens/TournamentDetailScreen';
import MyTournamentsScreen from '../features/tournaments/screens/MyTournamentsScreen';
import ReservationsScreen from '../features/reservations/screens/ReservationsScreen';
import ProfileScreen from '../features/profile/screens/ProfileScreen';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

function FieldsStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="FieldsList" component={FieldsScreen} options={{ title: 'Canchas' }} />
      <Stack.Screen name="FieldDetail" component={FieldDetailScreen} />
      <Stack.Screen name="CreateReservation" component={CreateReservationScreen} options={{ title: 'Reservar cancha' }} />
    </Stack.Navigator>
  );
}

function TeamsStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="TeamsList" component={TeamsScreen} options={{ title: 'Equipos' }} />
      <Stack.Screen name="TeamDetail" component={TeamDetailScreen} />
      <Stack.Screen name="MyTeams" component={MyTeamsScreen} />
      <Stack.Screen name="CreateTeam" component={CreateTeamScreen} />
    </Stack.Navigator>
  );
}

function TournamentsStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="TournamentsList" component={TournamentsScreen} options={{ title: 'Torneos' }} />
      <Stack.Screen name="TournamentDetail" component={TournamentDetailScreen} />
      <Stack.Screen name="MyTournaments" component={MyTournamentsScreen} />
    </Stack.Navigator>
  );
}

function ReservationsStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="ReservationsList" component={ReservationsScreen} options={{ title: 'Reservaciones' }} />
      <Stack.Screen name="CreateReservation" component={CreateReservationScreen} options={{ title: 'Nueva reservación' }} />
    </Stack.Navigator>
  );
}

export default function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: COLORS.primary,
        tabBarInactiveTintColor: COLORS.secondary,
        tabBarStyle: {
          backgroundColor: COLORS.surface,
          height: 60,
          borderTopColor: COLORS.border
        },
        tabBarIcon: ({ color, size }) => {
          let iconName = 'circle';

          if (route.name === 'Fields') iconName = 'sports-soccer';
          if (route.name === 'Teams') iconName = 'groups';
          if (route.name === 'Tournaments') iconName = 'emoji-events';
          if (route.name === 'Reservations') iconName = 'event';
          if (route.name === 'Profile') iconName = 'person';

          return <MaterialIcons name={iconName} color={color} size={size} />;
        }
      })}
    >
      <Tab.Screen name="Fields" component={FieldsStack} />
      <Tab.Screen name="Teams" component={TeamsStack} />
      <Tab.Screen name="Tournaments" component={TournamentsStack} />
      <Tab.Screen name="Reservations" component={ReservationsStack} />
      <Tab.Screen name="Profile" component={ProfileScreen} options={{ headerShown: true }} />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.background
  },
  title: {
    color: COLORS.primary,
    fontSize: FONT_SIZE.l
  }
});
