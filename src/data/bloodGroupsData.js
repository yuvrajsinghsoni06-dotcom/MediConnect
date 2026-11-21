/**
 * Blood Group Reference Information
 * 
 * DISCLAIMER:
 * This reference information is provided for general educational purposes only.
 * Final cross-matching, antibody screening, and compatibility determination 
 * must always be performed by licensed laboratory technicians and healthcare providers.
 */

export const bloodGroupsData = [
  {
    group: "O-",
    name: "O Negative",
    type: "Universal Red Cell Donor",
    canDonateTo: ["All blood types (O-, O+, A-, A+, B-, B+, AB-, AB+)"],
    canReceiveFrom: ["O- only"],
    prevalence: "~7% of population",
    urgencyLevel: "Critical Need",
    description: "The universal red blood cell donor. Vital for trauma centers, emergency surgeries, and newborn transfusions when there is no time for antibody crossmatching."
  },
  {
    group: "O+",
    name: "O Positive",
    type: "Most Common Blood Type",
    canDonateTo: ["O+", "A+", "B+", "AB+"],
    canReceiveFrom: ["O+", "O-"],
    prevalence: "~38% of population",
    urgencyLevel: "High Demand",
    description: "The most frequently requested blood type. It is routinely used in standard emergency transfusions for any Rh-positive recipient."
  },
  {
    group: "A-",
    name: "A Negative",
    type: "Rare Rh-Negative Group",
    canDonateTo: ["A-", "A+", "AB-", "AB+"],
    canReceiveFrom: ["A-", "O-"],
    prevalence: "~6% of population",
    urgencyLevel: "High Need",
    description: "Key donor group for A- and AB- patients. Often in short supply in metropolitan blood repositories."
  },
  {
    group: "A+",
    name: "A Positive",
    type: "Common Blood Group",
    canDonateTo: ["A+", "AB+"],
    canReceiveFrom: ["A+", "A-", "O+", "O-"],
    prevalence: "~34% of population",
    urgencyLevel: "Moderate",
    description: "One of the most common blood groups, essential for scheduled cancer therapies, orthopedic surgeries, and intensive care units."
  },
  {
    group: "B-",
    name: "B Negative",
    type: "Very Rare Blood Type",
    canDonateTo: ["B-", "B+", "AB-", "AB+"],
    canReceiveFrom: ["B-", "O-"],
    prevalence: "~2% of population",
    urgencyLevel: "Critical Need",
    description: "Extremely rare in the general population. Maintaining dedicated active donor lists for B- is critical to prevent fatal delays."
  },
  {
    group: "B+",
    name: "B Positive",
    type: "High Demand in Asia",
    canDonateTo: ["B+", "AB+"],
    canReceiveFrom: ["B+", "B-", "O+", "O-"],
    prevalence: "~9% - 20% regionally",
    urgencyLevel: "High Demand",
    description: "Particularly prevalent in South Asian demographics. Widely required for trauma management and hemoglobinopathies."
  },
  {
    group: "AB-",
    name: "AB Negative",
    type: "Rarest Blood Type",
    canDonateTo: ["AB-", "AB+"],
    canReceiveFrom: ["AB-", "A-", "B-", "O-"],
    prevalence: "<1% of population",
    urgencyLevel: "Specialized Need",
    description: "The rarest blood group globally. While red cell demand is specialized, AB- donors are prized universal plasma donors."
  },
  {
    group: "AB+",
    name: "AB Positive",
    type: "Universal Red Cell Receiver",
    canDonateTo: ["AB+ only"],
    canReceiveFrom: ["All blood types (Universal Receiver)"],
    prevalence: "~3% of population",
    urgencyLevel: "Plasma Priority",
    description: "Known as the universal recipient for red cells. AB+ donors are also universal donors for plasma and platelets."
  }
];
