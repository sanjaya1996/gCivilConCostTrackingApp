// import Phase from "../models/phase";

// export const PHASES = [
//   new Phase("p1", "Construction"),
//   new Phase("p2", "Interior Design"),
//   new Phase("p3", "Maintainance"),
// ];

import Category from "../models/category";
import MiniPhase from "../models/miniPhase";
import MiniPhaseMaterial from "../models/miniPhaseMaterial";
import Project from "../models/project";
import MiniPhaseMiscellaneous from "../models/miniPhaseMiscellaneous";
import UserNote from "../models/userNote";

export const PROJECTS = [
  new Project(
    "p1",
    "cl1",
    "s1",
    "Sydney Airport Project",
    "Sydney NSW 2020",
    "13 Aug 2020",
    "13 Aug 2020",
    0
  ),
  new Project(
    "p2",
    "cl2",
    "s2",
    "Allawah House Building",
    "Sydney NSW 2020",
    "13 Aug 2020",
    "13 Aug 2020",
    0
  ),
];

export const CATEGORIES = [
  new Category("c1", "p1", "Construction", "13 Aug 2020", "14 Aug 2020", 0),
  new Category("c2", "p1", "Interior Design", "13 Aug 2020", "14 Aug 2020", 0),
  new Category("c3", "p1", "Maintenance", "13 Aug 2020", "14 Aug 2020", 0),
];

export const MINIPHASES = [
  new MiniPhase(
    "mp1",
    "c1",
    "Marking",
    "completed",
    "This is Construction's Marking."
  ),
  new MiniPhase(
    "mp2",
    "c1",
    "Excavation",
    "running",
    "This is Construction's Marking."
  ),
  new MiniPhase(
    "mp3",
    "c1",
    "Flooring and Finishing",
    "notStarted",
    "This is Construction's Marking."
  ),
  new MiniPhase(
    "mp4",
    "c2",
    "Interior Marking",
    "completed",
    "This is Interior's Marking."
  ),
  new MiniPhase(
    "mp5",
    "c2",
    "Interior Excavation",
    "running",
    "This is Interior's Excavation."
  ),
  new MiniPhase(
    "mp6",
    "c2",
    "Interior Flooring and Finishing",
    "notStarted",
    "This is Interior's Finishing."
  ),
  new MiniPhase(
    "mp7",
    "c3",
    "Maintainance Marking",
    "completed",
    "This is Maintainance's Marking."
  ),
  new MiniPhase(
    "mp8",
    "c3",
    "Maintainance Excavation",
    "running",
    "This is Excavation's Marking."
  ),
  new MiniPhase(
    "mp9",
    "c3",
    "Maintainance Flooring and Finishing",
    "notStarted",
    "This is Maintainance's Finishing."
  ),
];

export const MINIPHASEMATERIALS = [
  new MiniPhaseMaterial(
    "mpm1",
    "mp1",
    "c1",
    "Concrete",
    10,
    50,
    0,
    "This is the Materal Description"
  ),
  new MiniPhaseMaterial(
    "mpm2",
    "mp1",
    "c1",
    "Sand",
    10,
    50,
    0,
    "This is the Materal Description"
  ),
  new MiniPhaseMaterial(
    "mpm3",
    "mp1",
    "c1",
    "Bricks",
    10,
    50,
    0,
    "This is the Materal Description"
  ),
  new MiniPhaseMaterial(
    "mpm1",
    "mp2",
    "c1",
    "Concrete",
    10,
    50,
    0,
    "This is the Materal Description"
  ),
  new MiniPhaseMaterial(
    "mpm2",
    "mp2",
    "c1",
    "Sand",
    10,
    50,
    0,
    "This is the Materal Description"
  ),
  new MiniPhaseMaterial(
    "mpm3",
    "mp2",
    "c1",
    "Bricks",
    10,
    50,
    0,
    "This is the Materal Description"
  ),
  new MiniPhaseMaterial(
    "mpm1",
    "mp3",
    "c1",
    "Marble",
    10,
    50,
    0,
    "This is the Materal Description"
  ),
  new MiniPhaseMaterial(
    "mpm2",
    "mp3",
    "c1",
    "Sand",
    10,
    50,
    0,
    "This is the Materal Description"
  ),
  new MiniPhaseMaterial(
    "mpm3",
    "mp3",
    "c1",
    "Bricks",
    10,
    50,
    0,
    "This is the Materal Description"
  ),
];

export const MINIPHASEMISCELLANIES = [
  new MiniPhaseMiscellaneous(
    "msc1",
    "mp1",
    "c1",
    "Transpot Expenses",
    "This is transportation description",
    0
  ),
  new MiniPhaseMiscellaneous(
    "msc2",
    "mp1",
    "c1",
    "Marketing",
    "This is Marketing description",
    0
  ),
  new MiniPhaseMiscellaneous(
    "msc3",
    "mp1",
    "c1",
    "Advertising",
    "This is Advertising description",
    0
  ),
  new MiniPhaseMiscellaneous(
    "msc4",
    "mp2",
    "c1",
    "Transportation",
    "This is transportation description",
    0
  ),
  new MiniPhaseMiscellaneous(
    "msc5",
    "mp2",
    "c1",
    "Meeting",
    "This is Meeting description",
    0
  ),
  new MiniPhaseMiscellaneous(
    "msc6",
    "mp2",
    "c1",
    "Marketing",
    "This is Marketing description",
    0
  ),
  new MiniPhaseMiscellaneous(
    "msc7",
    "mp3",
    "c1",
    "Transport Expenses",
    "This is transportation description",
    0
  ),
  new MiniPhaseMiscellaneous(
    "msc8",
    "mp3",
    "c1",
    "Meeting",
    "This is Meeting description",
    0
  ),
  new MiniPhaseMiscellaneous(
    "msc9",
    "mp3",
    "c1",
    "Party",
    "This is Project Team Party description",
    0
  ),
];

export const USERNOTES = [
  new UserNote(
    "un1",
    "First Note",
    "This is the description of first note.",
    [],
    "2020-09-16T02:45:00.000Z",
    "8dc3c25d-3f25-4499-9389-f5448cb8068d",
    "u1"
  ),
  new UserNote(
    "un2",
    "Second Note",
    "This is the description of Second note.",
    [
      {
        uri:
          "file:///data/user/0/host.exp.exponent/cache/ExperienceData/%2540anonymous%252FcostTrackingApp-0e513c1c-8ed1-4b95-9d39-46d688c76ad4/ImagePicker/51fbdfb4-2ac6-4ef4-bdd8-83b37ca9fee9.jpg",
      },
      {
        uri:
          "file:///data/user/0/host.exp.exponent/cache/ExperienceData/%2540anonymous%252FcostTrackingApp-0e513c1c-8ed1-4b95-9d39-46d688c76ad4/ImagePicker/fe5e2b17-92d5-4856-a8be-8211e9c9881a.jpg",
      },
    ],
    null,
    null,
    "u1"
  ),
  new UserNote(
    "un3",
    "Third Note",
    "This is the description of Third note.",
    [
      {
        uri:
          "file:///data/user/0/host.exp.exponent/cache/ExperienceData/%2540anonymous%252FcostTrackingApp-0e513c1c-8ed1-4b95-9d39-46d688c76ad4/ImagePicker/51fbdfb4-2ac6-4ef4-bdd8-83b37ca9fee9.jpg",
      },
      {
        uri:
          "file:///data/user/0/host.exp.exponent/cache/ExperienceData/%2540anonymous%252FcostTrackingApp-0e513c1c-8ed1-4b95-9d39-46d688c76ad4/ImagePicker/fe5e2b17-92d5-4856-a8be-8211e9c9881a.jpg",
      },
    ],
    null,
    null,
    "u1"
  ),
  new UserNote(
    "un4",
    "Fourth Note",
    "This is the description of Fourth note.",
    [
      {
        uri:
          "file:///data/user/0/host.exp.exponent/cache/ExperienceData/%2540anonymous%252FcostTrackingApp-0e513c1c-8ed1-4b95-9d39-46d688c76ad4/ImagePicker/51fbdfb4-2ac6-4ef4-bdd8-83b37ca9fee9.jpg",
      },
      {
        uri:
          "file:///data/user/0/host.exp.exponent/cache/ExperienceData/%2540anonymous%252FcostTrackingApp-0e513c1c-8ed1-4b95-9d39-46d688c76ad4/ImagePicker/fe5e2b17-92d5-4856-a8be-8211e9c9881a.jpg",
      },
    ],
    null,
    null,
    "u1"
  ),
];
