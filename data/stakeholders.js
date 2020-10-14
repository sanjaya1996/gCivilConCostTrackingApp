import Client from "../models/client";
import Labor from "../models/labor";
import Manager from "../models/manager";
import MiniPhaseLabor from "../models/miniPhaseLabor";

export const CLIENTS = [
  new Client(
    "cl1",
    "p1",
    "Sweta",
    "Thakur",
    "sweta123@gmail.com",
    "0434794888"
  ),
  new Client(
    "cl2",
    "p2",
    "Sameem",
    "Chisthi",
    "sameem123@gmail.com",
    "0434794778"
  ),
];

export const LABORS = [
  new Labor(
    "l1",
    "Sanjeevani",
    "Baidhya",
    "sanjeevani123@gmail.com",
    "0434794888",
    "Role1",
    "All days",
    35,
    "2212-534 67483"
  ),
  new Labor(
    "l2",
    "Biwash",
    "KC",
    "biwash123@gmail.com",
    "0434794888",
    "Role1",
    "All days",
    35,
    "2212-534 67483"
  ),
];

export const MINIPHASELABORS = [
  new MiniPhaseLabor(
    "ml1",
    "mp1",
    "c1",
    "Apple",
    "Mahommad",
    "apple123@gmail.com",
    "0434794888",
    "Scaffolder's Labourer",
    "Monday, Saturday and Sunday",
    35,
    0,
    "2212-534 67483",
    "This is the description about this Labor"
  ),
  new MiniPhaseLabor(
    "ml2",
    "mp1",
    "c1",
    "Pratham",
    "Adhikari",
    "pratham@gmail.com",
    "0434794888",
    "Landscaper's Labourer",
    "Wednesday, Thursday and Friday",
    35,
    0,
    "2212-534 67483",
    "This is the description about this Labor"
  ),
  new MiniPhaseLabor(
    "ml3",
    "mp2",
    "c1",
    "Sanjeevani",
    "Vaidya",
    "sanjeevani@gmail.com",
    "0434794888",
    "Landscaper's Labourer",
    "Monday, Tuesday and Friday",
    35,
    0,
    "2212-534 67483",
    "This is the description about this Labor"
  ),
  new MiniPhaseLabor(
    "ml4",
    "mp2",
    "c1",
    "Biwash",
    "Ojha",
    "ojhaBiwash@gmail.com",
    "0434794888",
    "Demolition Labourer",
    "Monday, Thursday and Friday",
    35,
    0,
    "2212-534 67483",
    "This is the description about this Labor"
  ),
  new MiniPhaseLabor(
    "ml5",
    "mp2",
    "c1",
    "John",
    "Malley",
    "john@gmail.com",
    "0434794888",
    "Demolition Labourer",
    "Monday, Thursday and Friday",
    35,
    0,
    "2212-534 67483",
    "This is the description about this Labor"
  ),
  new MiniPhaseLabor(
    "ml6",
    "mp2",
    "c1",
    "James",
    "Hansin",
    "james@gmail.com",
    "0434794888",
    "Demolition Labourer",
    "Monday, Thursday and Friday",
    35,
    0,
    "2212-534 67483",
    "This is the description about this Labor"
  ),
];

export const MANAGERS = [
  new Manager("m1", "Sanjay", "Dahal", "sanzay123@gmail.com", "0434794888"),
  new Manager("m2", "Sameem", "Chisthi", "sameem123@gmail.com", "0434794888"),
];
