export const CATEGORIES = [
  "Electronics", "Bags", "ID Cards", "Keys", "Clothing", "Books", "Water Bottles", "Other",
];

export const mockItems = [
  {
    id: "LF-108231",
    type: "lost",
    title: "Black Dell laptop charger",
    category: "Electronics",
    location: "Library, 2nd floor",
    description: "65W charger, small scuff on the brick. Left near the window seats.",
    reporter: "Aditi Sharma",
    status: "open",
    date: "2026-07-08",
    image: null,
  },
  {
    id: "LF-108214",
    type: "found",
    title: "Blue backpack (Wildcraft)",
    category: "Bags",
    location: "Canteen, near counter 2",
    description: "Found after lunch rush. Has a keychain and a notebook inside.",
    reporter: "Security Desk",
    status: "pending",
    date: "2026-07-08",
    image: null,
  },
  {
    id: "LF-108190",
    type: "found",
    title: "College ID card — Rohan M.",
    category: "ID Cards",
    location: "Main gate",
    description: "Found on the ground near the gate scanner this morning.",
    reporter: "Watchman, Gate 1",
    status: "approved",
    date: "2026-07-07",
    image: null,
  },
  {
    id: "LF-108177",
    type: "lost",
    title: "Silver house keys, 3 on a ring",
    category: "Keys",
    location: "Parking lot B",
    description: "Small red rubber grip on one key. Lost sometime yesterday evening.",
    reporter: "Priya Nair",
    status: "resolved",
    date: "2026-07-06",
    image: null,
  },
  {
    id: "LF-108150",
    type: "lost",
    title: "Grey hoodie, size M",
    category: "Clothing",
    location: "Sports ground",
    description: "Left on the bleachers after practice. Has a small tear on one sleeve.",
    reporter: "Karan Verma",
    status: "open",
    date: "2026-07-05",
    image: null,
  },
  {
    id: "LF-108132",
    type: "found",
    title: "Steel water bottle, dented",
    category: "Water Bottles",
    location: "Chemistry lab, Block C",
    description: "Left behind after the 11am practical batch.",
    reporter: "Lab Assistant",
    status: "open",
    date: "2026-07-04",
    image: null,
  },
];

// Items reported by the currently logged-in demo user — powers "My Dashboard".
export const myMockItems = [
  { ...mockItems[0], reporter: "You" },
  { ...mockItems[4], reporter: "You" },
];

// Claims the currently logged-in demo user has submitted — powers "My Dashboard".
export const myMockClaims = [
  {
    id: "CL-4021",
    item: mockItems[2],
    proofText: "It has a small dent on the bottom-left corner and my student photo.",
    status: "pending",
    submittedDate: "2026-07-09",
  },
  {
    id: "CL-3988",
    item: mockItems[3],
    proofText: "Red rubber grip on one key, the others are house keys with a Yale logo.",
    status: "approved",
    submittedDate: "2026-07-06",
  },
];

// Users awaiting identity verification — powers the Admin dashboard queue.
export const mockPendingVerifications = [
  {
    id: "USR-2291",
    name: "Ritika Sharma",
    email: "ritika.s@gmail.com",
    designation: "student",
    campusId: "STU2024118",
    submittedDate: "2026-07-12",
  },
  {
    id: "USR-2288",
    name: "Manoj Kumar",
    email: "manojk.maint@gmail.com",
    designation: "worker",
    campusId: "STF0092",
    submittedDate: "2026-07-11",
  },
  {
    id: "USR-2276",
    name: "Dr. Anjali Deshpande",
    email: "anjali.d@gmail.com",
    designation: "faculty",
    campusId: "FAC0031",
    submittedDate: "2026-07-10",
  },
];
