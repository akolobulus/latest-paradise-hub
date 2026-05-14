import { useState, useEffect, type ChangeEvent } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Camera, Edit2, X, Upload, ChevronDown, Plus, 
  Linkedin, Facebook, Twitter, Youtube, Instagram,
  Globe, Heart, Check, ArrowLeft, FileText, Trophy,
  GraduationCap, Users, HelpCircle, User, LogOut, Menu, Bell
} from "lucide-react";
import { Country, State, City } from "country-state-city";
import BrandLogo from "./BrandLogo";
import NotificationBell from "./NotificationBell";
import PageFooter from "./PageFooter";
import { cn } from "@/src/lib/utils";

const NIGERIA_COUNTRY_NAME = "Nigeria";
const NIGERIA_STATES = [
  "Abia",
  "Adamawa",
  "Akwa Ibom",
  "Anambra",
  "Bauchi",
  "Bayelsa",
  "Benue",
  "Borno",
  "Cross River",
  "Delta",
  "Ebonyi",
  "Edo",
  "Ekiti",
  "Enugu",
  "FCT",
  "Gombe",
  "Imo",
  "Jigawa",
  "Kaduna",
  "Kano",
  "Katsina",
  "Kebbi",
  "Kogi",
  "Kwara",
  "Lagos",
  "Nasarawa",
  "Niger",
  "Ogun",
  "Ondo",
  "Osun",
  "Oyo",
  "Plateau",
  "Sokoto",
  "Taraba",
  "Yobe",
  "Zamfara"
];

const NIGERIA_LGAS: Record<string, string[]> = {
  Abia: [
    "Aba North",
    "Aba South",
    "Arochukwu",
    "Bende",
    "Ikwuano",
    "Isiala Ngwa North",
    "Isiala Ngwa South",
    "Isuikwuato",
    "Obi Ngwa",
    "Ohafia",
    "Osisioma",
    "Ugwunagbo",
    "Ukwa East",
    "Ukwa West",
    "Umuahia North",
    "Umuahia South",
    "Umu Nneochi"
  ],
  Adamawa: [
    "Demsa",
    "Fufure",
    "Ganye",
    "Guyuk",
    "Gombi",
    "Girei",
    "Hong",
    "Jada",
    "Larmurde",
    "Madagali",
    "Maiha",
    "Mayo Belwa",
    "Michika",
    "Mubi North",
    "Mubi South",
    "Numan",
    "Shelleng",
    "Song",
    "Toungo",
    "Yola North",
    "Yola South"
  ],
  "Akwa Ibom": [
    "Abak",
    "Eastern Obolo",
    "Eket",
    "Esit Eket",
    "Essien Udim",
    "Etim Ekpo",
    "Etinan",
    "Ibeno",
    "Ibesikpo Asutan",
    "Ibiono-Ibom",
    "Ika",
    "Ikono",
    "Ikot Abasi",
    "Ikot Ekpene",
    "Ini",
    "Itu",
    "Mbo",
    "Mkpat-Enin",
    "Nsit-Atai",
    "Nsit-Ibom",
    "Nsit-Ubium",
    "Obot Akara",
    "Okobo",
    "Onna",
    "Oron",
    "Oruk Anam",
    "Udung-Uko",
    "Ukanafun",
    "Uruan",
    "Urue-Offong Oruko",
    "Uyo"
  ],
  Anambra: [
    "Aguata",
    "Anambra East",
    "Anambra West",
    "Anaocha",
    "Awka North",
    "Awka South",
    "Ayamelum",
    "Dunukofia",
    "Ekwusigo",
    "Idemili North",
    "Idemili South",
    "Ihiala",
    "Njikoka",
    "Nnewi North",
    "Nnewi South",
    "Ogbaru",
    "Onitsha North",
    "Onitsha South",
    "Orumba North",
    "Orumba South",
    "Oyi"
  ],
  Bauchi: [
    "Alkaleri",
    "Bauchi",
    "Bogoro",
    "Damban",
    "Darazo",
    "Dass",
    "Gamawa",
    "Ganjuwa",
    "Giade",
    "Itas-Gadau",
    "Jama'are",
    "Katagum",
    "Kirfi",
    "Misau",
    "Ningi",
    "Shira",
    "Tafawa Balewa",
    "Toro",
    "Warji",
    "Zaki"
  ],
  Bayelsa: [
    "Brass",
    "Ekeremor",
    "Kolokuma Opokuma",
    "Nembe",
    "Ogbia",
    "Sagbama",
    "Southern Ijaw",
    "Yenagoa"
  ],
  Benue: [
    "Agatu",
    "Apa",
    "Ado",
    "Buruku",
    "Gboko",
    "Guma",
    "Gwer East",
    "Gwer West",
    "Katsina-Ala",
    "Konshisha",
    "Kwande",
    "Logo",
    "Makurdi",
    "Obi",
    "Ogbadibo",
    "Ohimini",
    "Oju",
    "Okpokwu",
    "Oturkpo",
    "Tarka",
    "Ukum",
    "Ushongo",
    "Vandeikya"
  ],
  Borno: [
    "Abadam",
    "Askira-Uba",
    "Bama",
    "Bayo",
    "Biu",
    "Chibok",
    "Damboa",
    "Dikwa",
    "Gubio",
    "Guzamala",
    "Gwoza",
    "Hawul",
    "Jere",
    "Kaga",
    "Kala-Balge",
    "Konduga",
    "Kukawa",
    "Kwaya Kusar",
    "Mafa",
    "Magumeri",
    "Maiduguri",
    "Marte",
    "Mobbar",
    "Monguno",
    "Ngala",
    "Nganzai",
    "Shani"
  ],
  "Cross River": [
    "Abi",
    "Akamkpa",
    "Akpabuyo",
    "Bakassi",
    "Bekwarra",
    "Biase",
    "Boki",
    "Calabar Municipal",
    "Calabar South",
    "Etung",
    "Ikom",
    "Obanliku",
    "Obubra",
    "Obudu",
    "Odukpani",
    "Ogoja",
    "Yakuur",
    "Yala"
  ],
  Delta: [
    "Aniocha North",
    "Aniocha South",
    "Bomadi",
    "Burutu",
    "Ethiope East",
    "Ethiope West",
    "Ika North East",
    "Ika South",
    "Isoko North",
    "Isoko South",
    "Ndokwa East",
    "Ndokwa West",
    "Okpe",
    "Oshimili North",
    "Oshimili South",
    "Patani",
    "Sapele",
    "Udu",
    "Ughelli North",
    "Ughelli South",
    "Ukwuani",
    "Uvwie",
    "Warri North",
    "Warri South",
    "Warri South West"
  ],
  Ebonyi: [
    "Abakaliki",
    "Afikpo North",
    "Afikpo South",
    "Ebonyi",
    "Ezza North",
    "Ezza South",
    "Ikwo",
    "Ishielu",
    "Ivo",
    "Izzi",
    "Ohaozara",
    "Ohaukwu",
    "Onicha"
  ],
  Edo: [
    "Akoko-Edo",
    "Egor",
    "Esan Central",
    "Esan North-East",
    "Esan South-East",
    "Esan West",
    "Etsako Central",
    "Etsako East",
    "Etsako West",
    "Igueben",
    "Ikpoba Okha",
    "Orhionmwon",
    "Oredo",
    "Ovia North-East",
    "Ovia South-West",
    "Owan East",
    "Owan West",
    "Uhunmwonde"
  ],
  Ekiti: [
    "Ado Ekiti",
    "Efon",
    "Ekiti East",
    "Ekiti South-West",
    "Ekiti West",
    "Emure",
    "Gbonyin",
    "Ido Osi",
    "Ijero",
    "Ikere",
    "Ikole",
    "Ilejemeje",
    "Irepodun-Ifelodun",
    "Ise-Orun",
    "Moba",
    "Oye"
  ],
  Enugu: [
    "Aninri",
    "Awgu",
    "Enugu East",
    "Enugu North",
    "Enugu South",
    "Ezeagu",
    "Igbo Etiti",
    "Igbo Eze North",
    "Igbo Eze South",
    "Isi Uzo",
    "Nkanu East",
    "Nkanu West",
    "Nsukka",
    "Oji River",
    "Udenu",
    "Udi",
    "Uzo Uwani"
  ],
  FCT: [
    "Abaji",
    "Bwari",
    "Gwagwalada",
    "Kuje",
    "Kwali",
    "Municipal Area Council"
  ],
  Gombe: [
    "Akko",
    "Balanga",
    "Billiri",
    "Dukku",
    "Funakaye",
    "Gombe",
    "Kaltungo",
    "Kwami",
    "Nafada",
    "Shongom",
    "Yamaltu-Deba"
  ],
  Imo: [
    "Aboh Mbaise",
    "Ahiazu Mbaise",
    "Ehime Mbano",
    "Ezinihitte",
    "Ideato North",
    "Ideato South",
    "Ihitte-Uboma",
    "Ikeduru",
    "Isiala Mbano",
    "Isu",
    "Mbaitoli",
    "Ngor Okpala",
    "Njaba",
    "Nkwerre",
    "Nwangele",
    "Obowo",
    "Oguta",
    "Ohaji-Egbema",
    "Okigwe",
    "Orlu",
    "Orsu",
    "Oru East",
    "Oru West",
    "Owerri Municipal",
    "Owerri North",
    "Owerri West",
    "Unuimo"
  ],
  Jigawa: [
    "Auyo",
    "Babura",
    "Biriniwa",
    "Birnin Kudu",
    "Buji",
    "Dutse",
    "Gagarawa",
    "Garki",
    "Gumel",
    "Guri",
    "Gwaram",
    "Gwiwa",
    "Hadejia",
    "Jahun",
    "Kafin Hausa",
    "Kazaure",
    "Kiri Kasama",
    "Kiyawa",
    "Kaugama",
    "Maigatari",
    "Malam Madori",
    "Miga",
    "Ringim",
    "Roni",
    "Sule Tankarkar",
    "Taura",
    "Yankwashi"
  ],
  Kaduna: [
    "Birnin Gwari",
    "Chikun",
    "Giwa",
    "Igabi",
    "Ikara",
    "Jaba",
    "Jema'a",
    "Kachia",
    "Kaduna North",
    "Kaduna South",
    "Kagarko",
    "Kajuru",
    "Kaura",
    "Kauru",
    "Kubau",
    "Kudan",
    "Lere",
    "Makarfi",
    "Sabon Gari",
    "Sanga",
    "Soba",
    "Zangon Kataf",
    "Zaria"
  ],
  Kano: [
    "Ajingi",
    "Albasu",
    "Bagwai",
    "Bebeji",
    "Bichi",
    "Bunkure",
    "Dala",
    "Dambatta",
    "Dawakin Kudu",
    "Dawakin Tofa",
    "Doguwa",
    "Fagge",
    "Gabasawa",
    "Garko",
    "Garun Mallam",
    "Gaya",
    "Gezawa",
    "Gwale",
    "Gwarzo",
    "Kabo",
    "Kano Municipal",
    "Karaye",
    "Kibiya",
    "Kiru",
    "Kumbotso",
    "Kunchi",
    "Kura",
    "Madobi",
    "Makoda",
    "Minjibir",
    "Nasarawa",
    "Rano",
    "Rimin Gado",
    "Rogo",
    "Shanono",
    "Sumaila",
    "Takai",
    "Tarauni",
    "Tofa",
    "Tsanyawa",
    "Tudun Wada",
    "Ungogo",
    "Warawa",
    "Wudil"
  ],
  Katsina: [
    "Bakori",
    "Batagarawa",
    "Batsari",
    "Baure",
    "Bindawa",
    "Charanchi",
    "Dandume",
    "Danja",
    "Dan Musa",
    "Daura",
    "Dutsi",
    "Dutsin Ma",
    "Faskari",
    "Funtua",
    "Ingawa",
    "Jibia",
    "Kafur",
    "Kaita",
    "Kankara",
    "Kankia",
    "Katsina",
    "Kurfi",
    "Kusada",
    "Mai Adua",
    "Malumfashi",
    "Mani",
    "Mashi",
    "Matazu",
    "Musawa",
    "Rimi",
    "Sabuwa",
    "Safana",
    "Sandamu",
    "Zango"
  ],
  Kebbi: [
    "Aleiro",
    "Arewa Dandi",
    "Argungu",
    "Augie",
    "Bagudo",
    "Birnin Kebbi",
    "Bunza",
    "Dandi",
    "Fakai",
    "Gwandu",
    "Jega",
    "Kalgo",
    "Koko Besse",
    "Maiyama",
    "Ngaski",
    "Sakaba",
    "Shanga",
    "Suru",
    "Wasagu Danko",
    "Yauri",
    "Zuru"
  ],
  Kogi: [
    "Adavi",
    "Ajaokuta",
    "Ankpa",
    "Bassa",
    "Dekina",
    "Ibaji",
    "Idah",
    "Igalamela Odolu",
    "Ijumu",
    "Kabba Bunu",
    "Kogi",
    "Lokoja",
    "Mopa Muro",
    "Ofu",
    "Ogori Magongo",
    "Okehi",
    "Okene",
    "Olamaboro",
    "Omala",
    "Yagba East",
    "Yagba West"
  ],
  Kwara: [
    "Asa",
    "Baruten",
    "Edu",
    "Ekiti",
    "Ifelodun",
    "Ilorin East",
    "Ilorin South",
    "Ilorin West",
    "Irepodun",
    "Isin",
    "Kaiama",
    "Moro",
    "Offa",
    "Oke Ero",
    "Oyun",
    "Pategi"
  ],
  Lagos: [
    "Agege",
    "Ajeromi-Ifelodun",
    "Alimosho",
    "Amuwo-Odofin",
    "Apapa",
    "Badagry",
    "Epe",
    "Eti Osa",
    "Ibeju-Lekki",
    "Ifako-Ijaiye",
    "Ikeja",
    "Ikorodu",
    "Kosofe",
    "Lagos Island",
    "Lagos Mainland",
    "Mushin",
    "Ojo",
    "Oshodi-Isolo",
    "Shomolu",
    "Surulere"
  ],
  Nasarawa: [
    "Akwanga",
    "Awe",
    "Doma",
    "Karu",
    "Keana",
    "Keffi",
    "Kokona",
    "Lafia",
    "Nasarawa",
    "Nasarawa Egon",
    "Obi",
    "Toto",
    "Wamba"
  ],
  Niger: [
    "Agaie",
    "Agwara",
    "Bida",
    "Borgu",
    "Bosso",
    "Chanchaga",
    "Edati",
    "Gbako",
    "Gurara",
    "Katcha",
    "Kontagora",
    "Lapai",
    "Lavun",
    "Magama",
    "Mariga",
    "Mashegu",
    "Mokwa",
    "Moya",
    "Paikoro",
    "Rafi",
    "Rijau",
    "Shiroro",
    "Suleja",
    "Tafa",
    "Wushishi"
  ],
  Ogun: [
    "Abeokuta North",
    "Abeokuta South",
    "Ado-Odo Ota",
    "Yewa North",
    "Yewa South",
    "Ewekoro",
    "Ifo",
    "Ijebu East",
    "Ijebu North",
    "Ijebu North East",
    "Ijebu Ode",
    "Ikenne",
    "Imeko Afon",
    "Ipokia",
    "Obafemi Owode",
    "Odeda",
    "Odogbolu",
    "Ogun Waterside",
    "Remo North",
    "Shagamu"
  ],
  Ondo: [
    "Akoko North-East",
    "Akoko North-West",
    "Akoko South-West",
    "Akoko South-East",
    "Akure North",
    "Akure South",
    "Ese Odo",
    "Idanre",
    "Ifedore",
    "Ilaje",
    "Ile Oluji-Okeigbo",
    "Irele",
    "Odigbo",
    "Okitipupa",
    "Ondo East",
    "Ondo West",
    "Ose",
    "Owo"
  ],
  Osun: [
    "Atakunmosa East",
    "Atakunmosa West",
    "Aiyedaade",
    "Aiyedire",
    "Boluwaduro",
    "Boripe",
    "Ede North",
    "Ede South",
    "Ife Central",
    "Ife East",
    "Ife North",
    "Ife South",
    "Egbedore",
    "Ejigbo",
    "Ifedayo",
    "Ifelodun",
    "Ila",
    "Ilesa East",
    "Ilesa West",
    "Irepodun",
    "Irewole",
    "Isokan",
    "Iwo",
    "Obokun",
    "Odo Otin",
    "Ola Oluwa",
    "Olorunda",
    "Oriade",
    "Orolu",
    "Osogbo"
  ],
  Oyo: [
    "Afijio",
    "Akinyele",
    "Atiba",
    "Atisbo",
    "Egbeda",
    "Ibadan North",
    "Ibadan North-East",
    "Ibadan North-West",
    "Ibadan South-East",
    "Ibadan South-West",
    "Ibarapa Central",
    "Ibarapa East",
    "Ibarapa North",
    "Ido",
    "Irepo",
    "Iseyin",
    "Itesiwaju",
    "Iwajowa",
    "Kajola",
    "Lagelu",
    "Ogbomosho North",
    "Ogbomosho South",
    "Ogo Oluwa",
    "Olorunsogo",
    "Oluyole",
    "Ona Ara",
    "Orelope",
    "Ori Ire",
    "Oyo",
    "Oyo East",
    "Saki East",
    "Saki West",
    "Surulere"
  ],
  Plateau: [
    "Bokkos",
    "Barkin Ladi",
    "Bassa",
    "Jos East",
    "Jos North",
    "Jos South",
    "Kanam",
    "Kanke",
    "Langtang South",
    "Langtang North",
    "Mangu",
    "Mikang",
    "Pankshin",
    "Qua’an Pan",
    "Riyom",
    "Shendam",
    "Wase"
  ],
  Sokoto: [
    "Binji",
    "Bodinga",
    "Dange Shuni",
    "Gada",
    "Goronyo",
    "Gudu",
    "Gwadabawa",
    "Illela",
    "Isa",
    "Kebbe",
    "Kware",
    "Rabah",
    "Sabon Birni",
    "Shagari",
    "Silame",
    "Sokoto North",
    "Sokoto South",
    "Tambuwal",
    "Tangaza",
    "Tureta",
    "Wamako",
    "Wurno",
    "Yabo"
  ],
  Taraba: [
    "Ardo Kola",
    "Bali",
    "Donga",
    "Gashaka",
    "Gassol",
    "Ibi",
    "Jalingo",
    "Karim Lamido",
    "Kurmi",
    "Lau",
    "Sardauna",
    "Takum",
    "Ussa",
    "Wukari",
    "Yorro",
    "Zing"
  ],
  Yobe: [
    "Bade",
    "Bursari",
    "Damaturu",
    "Fika",
    "Fune",
    "Geidam",
    "Gujba",
    "Gulani",
    "Jakusko",
    "Karasuwa",
    "Machina",
    "Nangere",
    "Nguru",
    "Potiskum",
    "Tarmuwa",
    "Yunusari",
    "Yusufari"
  ],
  Zamfara: [
    "Anka",
    "Bakura",
    "Birnin Magaji/Kiyaw",
    "Bukkuyum",
    "Bungudu",
    "Gummi",
    "Gusau",
    "Kaura Namoda",
    "Maradun",
    "Maru",
    "Shinkafi",
    "Talata Mafara",
    "Chafe",
    "Zurmi"
  ]
};
import { supabase } from "@/src/lib/supabase";
import { calculateProfileCompletion, getProfileSections, ProfileData } from "@/src/lib/profileCompletion";
import { generateReferralLink } from "@/src/lib/referral";

const COUNTRIES = [
  "Afghanistan", "Albania", "Algeria", "Andorra", "Angola", "Antigua and Barbuda", "Argentina", "Armenia", "Australia", "Austria", "Azerbaijan",
  "Bahamas", "Bahrain", "Bangladesh", "Barbados", "Belarus", "Belgium", "Belize", "Benin", "Bhutan", "Bolivia", "Bosnia and Herzegovina", "Botswana", "Brazil", "Brunei", "Bulgaria", "Burkina Faso", "Burundi",
  "Cabo Verde", "Cambodia", "Cameroon", "Canada", "Central African Republic", "Chad", "Chile", "China", "Colombia", "Comoros", "Congo, Democratic Republic of the", "Congo, Republic of the", "Costa Rica", "Côte d'Ivoire", "Croatia", "Cuba", "Cyprus", "Czech Republic",
  "Denmark", "Djibouti", "Dominica", "Dominican Republic",
  "Ecuador", "Egypt", "El Salvador", "Equatorial Guinea", "Eritrea", "Estonia", "Eswatini", "Ethiopia",
  "Fiji", "Finland", "France",
  "Gabon", "Gambia", "Georgia", "Germany", "Ghana", "Greece", "Grenada", "Guatemala", "Guinea", "Guinea-Bissau", "Guyana",
  "Haiti", "Honduras", "Hungary",
  "Iceland", "India", "Indonesia", "Iran", "Iraq", "Ireland", "Israel", "Italy",
  "Jamaica", "Japan", "Jordan",
  "Kazakhstan", "Kenya", "Kiribati", "Korea, North", "Korea, South", "Kosovo", "Kuwait", "Kyrgyzstan",
  "Laos", "Latvia", "Lebanon", "Lesotho", "Liberia", "Libya", "Liechtenstein", "Lithuania", "Luxembourg",
  "Madagascar", "Malawi", "Malaysia", "Maldives", "Mali", "Malta", "Marshall Islands", "Mauritania", "Mauritius", "Mexico", "Micronesia", "Moldova", "Monaco", "Mongolia", "Montenegro", "Morocco", "Mozambique", "Myanmar",
  "Namibia", "Nauru", "Nepal", "Netherlands", "New Zealand", "Nicaragua", "Niger", "Nigeria", "North Macedonia", "Norway",
  "Oman",
  "Pakistan", "Palau", "Panama", "Papua New Guinea", "Paraguay", "Peru", "Philippines", "Poland", "Portugal",
  "Qatar",
  "Romania", "Russia", "Rwanda",
  "Saint Kitts and Nevis", "Saint Lucia", "Saint Vincent and the Grenadines", "Samoa", "San Marino", "Sao Tome and Principe", "Saudi Arabia", "Senegal", "Serbia", "Seychelles", "Sierra Leone", "Singapore", "Slovakia", "Slovenia", "Solomon Islands", "Somalia", "South Africa", "Spain", "Sri Lanka", "Sudan", "Sudan, South", "Suriname", "Sweden", "Switzerland", "Syria",
  "Taiwan", "Tajikistan", "Tanzania", "Thailand", "Timor-Leste", "Togo", "Tonga", "Trinidad and Tobago", "Tunisia", "Turkey", "Turkmenistan", "Tuvalu",
  "Uganda", "Ukraine", "United Arab Emirates", "United Kingdom", "United States", "Uruguay", "Uzbekistan",
  "Vanuatu", "Vatican City", "Venezuela", "Vietnam",
  "Yemen",
  "Zambia", "Zimbabwe"
];

interface ProfilePageProps {
  currentUserId?: string;
  points: number;
  user?: { full_name?: string; email?: string };
  onBack: () => void;
  onProfileUpdate?: (profile: ProfileData) => void;
  onViewCourseByTitle?: (courseTitle: string) => void;
  onRewardsClick: () => void;
  onViewLearning: () => void;
  onViewCommunity: () => void;
  onSupportClick?: () => void;
  onLogout: () => void;
}

type Tab = "Personal Information" | "Education Info" | "Work Info" | "Demographic Info";

export default function ProfilePage({ currentUserId, points, user, onBack, onProfileUpdate, onViewCourseByTitle, onRewardsClick, onViewLearning, onViewCommunity, onSupportClick, onLogout }: ProfilePageProps) {
  const [activeTab, setActiveTab] = useState<Tab>("Personal Information");
  const [editingSection, setEditingSection] = useState<string | null>(null);
  
  // Supabase State
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [showQuickActions, setShowQuickActions] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [referralCount, setReferralCount] = useState<number>(0);

  const inviteLink = currentUserId
    ? generateReferralLink(currentUserId)
    : window.location.origin;

  const handleCopyLink = async () => {
    if (!currentUserId) return;
    try {
      await navigator.clipboard.writeText(inviteLink);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy referral link:", err);
    }
  };
  
  // Cascading dropdown states for origin and residence
  const [originStates, setOriginStates] = useState<any[]>([]);
  const [originCities, setOriginCities] = useState<any[]>([]);
  const [residenceStates, setResidenceStates] = useState<any[]>([]);
  const [residenceCities, setResidenceCities] = useState<any[]>([]);
  
  // Form state for all fields
  const [editForm, setEditForm] = useState({
    firstName: "",
    lastName: "",
    gender: "",
    about_me: "",
    languages: [] as string[],
    phone_number: "",
    whatsapp_number: "",
    interests: [] as string[],
    country_of_origin: "",
    state_of_origin: "",
    city_of_origin: "",
    country_of_residence: "",
    state_of_residence: "",
    city_of_residence: "",
    education_level: "",
    institution: "",
    course_of_study: "",
    year_of_graduation: "",
    graduation_class: "",
    nysc_completed: "",
    employment_status: "",
    skill_level: "",
    english_proficiency: "",
    professional_experience: "",
    social_profiles: {
      linkedin: "",
      facebook: "",
      twitter: "",
      youtube: "",
      instagram: "",
      tiktok: ""
    }
  });

  const tabs: Tab[] = ["Personal Information", "Education Info", "Work Info", "Demographic Info"];
  const profileCompletion = calculateProfileCompletion(profile);
  const profileSections = getProfileSections(profile);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (error) throw error;
      
      if (data) {
        setProfile(data);

        const { count: referredCount, error: referralError } = await supabase
          .from("profiles")
          .select("id", { count: "exact", head: true })
          .eq("referred_by", user.id);

        if (referralError) {
          console.error("Error fetching referral count:", referralError);
        } else if (typeof referredCount === "number") {
          setReferralCount(referredCount);
        }

        // Initialize form with profile data
        const names = (data.full_name || "").split(" ");
        setEditForm({
          firstName: names[0] || "",
          lastName: names.slice(1).join(" ") || "",
          gender: data.gender || "",
          about_me: data.about_me || "",
          languages: data.languages || [],
          phone_number: data.phone_number || "",
          whatsapp_number: data.whatsapp_number || "",
          interests: data.interests || [],
          country_of_origin: data.country_of_origin || "",
          state_of_origin: data.state_of_origin || "",
          city_of_origin: data.city_of_origin || "",
          country_of_residence: data.country_of_residence || "",
          state_of_residence: data.state_of_residence || "",
          city_of_residence: data.city_of_residence || "",
          education_level: data.education_level || "",
          institution: data.institution || "",
          course_of_study: data.course_of_study || "",
          year_of_graduation: data.year_of_graduation || "",
          graduation_class: data.graduation_class || "",
          nysc_completed: data.nysc_completed || "",
          employment_status: data.employment_status || "",
          skill_level: data.skill_level || "",
          english_proficiency: data.english_proficiency || "",
          professional_experience: data.professional_experience || "",
          social_profiles: data.social_profiles || {
            linkedin: "",
            facebook: "",
            twitter: "",
            youtube: "",
            instagram: "",
            tiktok: ""
          }
        });

        // Initialize residence cascading dropdowns
        if (data.country_of_residence) {
          if (data.country_of_residence === NIGERIA_COUNTRY_NAME) {
            setResidenceStates(NIGERIA_STATES);
            if (data.state_of_residence) {
              setResidenceCities(NIGERIA_LGAS[data.state_of_residence] ?? []);
            }
          } else {
            const country = Country.getAllCountries().find((c: any) => c.name === data.country_of_residence);
            if (country) {
              const states = State.getStatesOfCountry(country.isoCode);
              setResidenceStates(states);
              
              if (data.state_of_residence) {
                const state = states.find((s: any) => s.name === data.state_of_residence);
                if (state) {
                  const cities = City.getCitiesOfState(country.isoCode, state.isoCode);
                  setResidenceCities(cities);
                }
              }
            }
          }
        }

        // Initialize origin cascading dropdowns
        if (data.country_of_origin) {
          if (data.country_of_origin === NIGERIA_COUNTRY_NAME) {
            setOriginStates(NIGERIA_STATES);
            if (data.state_of_origin) {
              setOriginCities(NIGERIA_LGAS[data.state_of_origin] ?? []);
            }
          } else {
            const originCountry = Country.getAllCountries().find((c: any) => c.name === data.country_of_origin);
            if (originCountry) {
              const originStatesList = State.getStatesOfCountry(originCountry.isoCode);
              setOriginStates(originStatesList);

              if (data.state_of_origin) {
                const originState = originStatesList.find((s: any) => s.name === data.state_of_origin);
                if (originState) {
                  const originCitiesList = City.getCitiesOfState(originCountry.isoCode, originState.isoCode);
                  setOriginCities(originCitiesList);
                }
              }
            }
          }
        }
      }
    } catch (error) {
      console.error("Error fetching profile:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Cascading dropdown handlers for origin and residence
  const handleResidenceCountryChange = (countryName: string) => {
    setEditForm(prev => ({
      ...prev,
      country_of_residence: countryName,
      state_of_residence: "", // Reset state when country changes
      city_of_residence: ""   // Reset city when country changes
    }));
    
    if (countryName) {
      if (countryName === NIGERIA_COUNTRY_NAME) {
        setResidenceStates(NIGERIA_STATES);
        setResidenceCities([]);
      } else {
        const country = Country.getAllCountries().find((c: any) => c.name === countryName);
        if (country) {
          const states = State.getStatesOfCountry(country.isoCode);
          setResidenceStates(states);
          setResidenceCities([]); // Clear cities when country changes
        }
      }
    } else {
      setResidenceStates([]);
      setResidenceCities([]);
    }
  };

  const handleResidenceStateChange = (stateName: string) => {
    setEditForm(prev => ({
      ...prev,
      state_of_residence: stateName,
      city_of_residence: "" // Reset city when state changes
    }));
    
    if (stateName && editForm.country_of_residence) {
      if (editForm.country_of_residence === NIGERIA_COUNTRY_NAME) {
        setResidenceCities(NIGERIA_LGAS[stateName] ?? []);
      } else {
        const country = Country.getAllCountries().find((c: any) => c.name === editForm.country_of_residence);
        if (country) {
          const state = State.getStatesOfCountry(country.isoCode).find((s: any) => s.name === stateName);
          if (state) {
            const cities = City.getCitiesOfState(country.isoCode, state.isoCode);
            setResidenceCities(cities);
          }
        }
      }
    } else {
      setResidenceCities([]);
    }
  };

  const handleOriginCountryChange = (countryName: string) => {
    setEditForm(prev => ({
      ...prev,
      country_of_origin: countryName,
      state_of_origin: "",
      city_of_origin: ""
    }));

    if (countryName) {
      if (countryName === NIGERIA_COUNTRY_NAME) {
        setOriginStates(NIGERIA_STATES);
        setOriginCities([]);
      } else {
        const country = Country.getAllCountries().find((c: any) => c.name === countryName);
        if (country) {
          const states = State.getStatesOfCountry(country.isoCode);
          setOriginStates(states);
          setOriginCities([]);
        }
      }
    } else {
      setOriginStates([]);
      setOriginCities([]);
    }
  };

  const handleOriginStateChange = (stateName: string) => {
    setEditForm(prev => ({
      ...prev,
      state_of_origin: stateName,
      city_of_origin: ""
    }));

    if (stateName && editForm.country_of_origin) {
      if (editForm.country_of_origin === NIGERIA_COUNTRY_NAME) {
        setOriginCities(NIGERIA_LGAS[stateName] ?? []);
      } else {
        const country = Country.getAllCountries().find((c: any) => c.name === editForm.country_of_origin);
        if (country) {
          const state = State.getStatesOfCountry(country.isoCode).find((s: any) => s.name === stateName);
          if (state) {
            const cities = City.getCitiesOfState(country.isoCode, state.isoCode);
            setOriginCities(cities);
          }
        }
      }
    } else {
      setOriginCities([]);
    }
  };

  const handleSaveProfile = async () => {
    if (!profile) return;
    setIsSaving(true);
    
    try {
      const fullName = `${editForm.firstName} ${editForm.lastName}`.trim();
      const updateData = {
        full_name: fullName,
        gender: editForm.gender,
        about_me: editForm.about_me,
        languages: editForm.languages.filter(Boolean),
        phone_number: editForm.phone_number,
        whatsapp_number: editForm.whatsapp_number,
        interests: editForm.interests.filter(Boolean),
        country_of_origin: editForm.country_of_origin,
        state_of_origin: editForm.state_of_origin,
        city_of_origin: editForm.city_of_origin,
        country_of_residence: editForm.country_of_residence,
        state_of_residence: editForm.state_of_residence,
        city_of_residence: editForm.city_of_residence,
        social_profiles: editForm.social_profiles,
      };

      const { error } = await supabase
        .from('profiles')
        .update(updateData)
        .eq('id', profile.id);

      if (error) {
        console.error("Supabase Update Error details:", error);
        throw new Error(error.message);
      }

      const updatedProfile = { ...profile, ...updateData } as ProfileData;
      setProfile(updatedProfile);
      setEditingSection(null);
      
      if (onProfileUpdate) {
        onProfileUpdate(updatedProfile);
      }
    } catch (error: any) {
      console.error("Error saving profile:", error);
      alert(`Failed to update profile: ${error.message || 'Check database columns'}`);
    } finally {
      setIsSaving(false);
    }
  };

  // Avatar Upload Handler
  const handleAvatarUpload = async (event: ChangeEvent<HTMLInputElement>) => {
    try {
      setIsUploading(true);
      
      if (!event.target.files || event.target.files.length === 0) {
        throw new Error('You must select an image to upload.');
      }

      const file = event.target.files[0];
      const fileExt = file.name.split('.').pop();
      // Path format: user_id/random_string.extension (Matches our RLS policy)
      const filePath = `${profile?.id}/${Math.random()}.${fileExt}`;

      // 1. Upload the file to the 'avatars' bucket
      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      // 2. Get the public URL for the newly uploaded image
      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath);

      // 3. Update the user's profile with the new avatar_url
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ avatar_url: publicUrl })
        .eq('id', profile?.id);

      if (updateError) throw updateError;

      // 4. Update the local UI state and notify parent
      setProfile(prev => {
        const updatedProfile = prev ? { ...prev, avatar_url: publicUrl } : null;
        // Notify parent component that profile was updated
        if (updatedProfile && onProfileUpdate) {
          onProfileUpdate(updatedProfile);
        }
        return updatedProfile;
      });
      
    } catch (error: any) {
      console.error("Error uploading avatar:", error);
      alert(error.message || "Failed to upload avatar.");
    } finally {
      setIsUploading(false);
    }
  };

  // Helper to get initials from full name
  const getInitials = (name?: string | null) => {
    if (!name) return "U";
    return name.split(" ").map(n => n[0]).join("").substring(0, 2).toUpperCase();
  };

  const renderModal = () => {
    if (!editingSection) return null;

    return (
      <AnimatePresence>
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setEditingSection(null)}
          />
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl overflow-hidden"
          >
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
              <div>
                <h3 className="text-xl font-bold text-ink">{editingSection}</h3>
                <p className="text-sm text-gray-500">Complete your information</p>
              </div>
              <button 
                onClick={() => setEditingSection(null)}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X size={20} className="text-gray-400" />
              </button>
            </div>

            <div className="p-8 max-h-[calc(100vh-4rem)] overflow-y-auto custom-scrollbar">
              {editingSection === "Basic Info" && (
                <div className="space-y-6">
                  <div className="flex flex-col md:flex-row gap-8 items-center">
                    
                    {/* Display current Avatar */}
                    <div className="w-32 h-32 rounded-full bg-gray-50 border-2 border-dashed border-gray-200 flex items-center justify-center text-gray-400 text-2xl font-bold relative overflow-hidden shrink-0">
                      {profile?.avatar_url ? (
                        <img src={profile.avatar_url} alt="Profile" className="w-full h-full object-cover" />
                      ) : (
                        getInitials(profile?.full_name)
                      )}
                      {isUploading && (
                        <div className="absolute inset-0 bg-white/80 flex items-center justify-center">
                          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
                        </div>
                      )}
                    </div>
                    
                    {/* File Upload Box */}
                    <div className="flex-1 w-full">
                      <label className={cn(
                        "border-2 border-dashed border-gray-200 rounded-2xl p-8 flex flex-col items-center justify-center gap-3 transition-colors group w-full",
                        isUploading ? "opacity-50 cursor-not-allowed" : "hover:border-primary/50 cursor-pointer"
                      )}>
                        <input 
                          type="file" 
                          accept="image/*"
                          onChange={handleAvatarUpload}
                          disabled={isUploading}
                          className="hidden"
                        />
                        <div className="w-10 h-10 rounded-full bg-primary/5 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                          <Upload size={20} />
                        </div>
                        <div className="text-center">
                          <p className="text-sm font-bold text-ink">
                            {isUploading ? "Uploading..." : <><span className="text-primary">Click to upload</span> or drag and drop</>}
                          </p>
                          <p className="text-xs text-gray-400 mt-1">PNG, JPG or JPEG</p>
                        </div>
                      </label>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-ink">First Name*</label>
                      <input 
                        type="text" 
                        value={editForm.firstName}
                        onChange={(e) => setEditForm({...editForm, firstName: e.target.value})}
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-ink">Last Name*</label>
                      <input 
                        type="text" 
                        value={editForm.lastName}
                        onChange={(e) => setEditForm({...editForm, lastName: e.target.value})}
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-ink">Gender*</label>
                      <div className="relative">
                        <select 
                          value={editForm.gender}
                          onChange={(e) => setEditForm({...editForm, gender: e.target.value})}
                          className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all appearance-none bg-white"
                        >
                          <option>Select the gender</option>
                          <option>Male</option>
                          <option>Female</option>
                          <option>Other</option>
                        </select>
                        <ChevronDown size={18} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {editingSection === "About" && (
                <div className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-ink">Tell us something about you</label>
                    <textarea 
                      value={editForm.about_me}
                      onChange={(e) => setEditForm({...editForm, about_me: e.target.value})}
                      placeholder="Write a brief introduction to show on your profile..."
                      className="w-full h-40 px-4 py-3 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all resize-none"
                    />
                  </div>
                </div>
              )}

              {editingSection === "Languages" && (
                <div className="space-y-6">
                  <p className="text-sm text-gray-500">Add the languages you speak (comma-separated)</p>
                  <div className="space-y-2">
                    <input 
                      type="text" 
                      value={editForm.languages.join(", ")}
                      onChange={(e) => setEditForm({...editForm, languages: e.target.value.split(",").map(i => i.trim())})}
                      placeholder="e.g. English, French, Yoruba"
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                    />
                  </div>
                </div>
              )}

              {editingSection === "Phone Number" && (
                <div className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-ink">Phone Number*</label>
                    <div className="flex gap-2">
                      <div className="w-24 px-3 py-3 rounded-xl border border-gray-200 flex items-center justify-between bg-gray-50">
                        <span className="text-sm">🇳🇬</span>
                        <ChevronDown size={14} className="text-gray-400" />
                      </div>
                      <input 
                        type="text" 
                        value={editForm.phone_number}
                        onChange={(e) => setEditForm({...editForm, phone_number: e.target.value})}
                        placeholder="+234"
                        className="flex-1 px-4 py-3 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-bold text-ink">WhatsApp Number*</label>
                    <div className="flex gap-2">
                      <div className="w-24 px-3 py-3 rounded-xl border border-gray-200 flex items-center justify-between bg-gray-50">
                        <span className="text-sm">🇳🇬</span>
                        <ChevronDown size={14} className="text-gray-400" />
                      </div>
                      <input 
                        type="text" 
                        value={editForm.whatsapp_number}
                        onChange={(e) => setEditForm({...editForm, whatsapp_number: e.target.value})}
                        placeholder="+234"
                        className="flex-1 px-4 py-3 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                      />
                    </div>
                  </div>

                  <label className="flex items-center gap-3 cursor-pointer group">
                    <div className="w-5 h-5 rounded border border-gray-300 flex items-center justify-center group-hover:border-primary transition-colors bg-primary">
                      <Check size={12} className="text-white" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-bold text-ink">The same as primary phone number</p>
                      <p className="text-xs text-gray-400">Paradise Hub will use this number for ease of communication with you.</p>
                    </div>
                  </label>
                </div>
              )}

              {editingSection === "Social Profile" && (
                <div className="space-y-6">
                  <p className="text-sm text-gray-500">Add your social links</p>
                  <div className="space-y-4">
                    {[
                      { key: "linkedin", label: "LinkedIn", icon: <Linkedin size={18} />, placeholder: "https://linkedin.com/in/" },
                      { key: "facebook", label: "Facebook", icon: <Facebook size={18} />, placeholder: "https://facebook.com/" },
                      { key: "twitter", label: "X (Twitter)", icon: <Twitter size={18} />, placeholder: "https://twitter.com/" },
                      { key: "youtube", label: "Youtube", icon: <Youtube size={18} />, placeholder: "https://youtube.com/" },
                      { key: "tiktok", label: "TikTok", icon: <Globe size={18} />, placeholder: "https://tiktok.com/" },
                      { key: "instagram", label: "Instagram", icon: <Instagram size={18} />, placeholder: "https://instagram.com/" },
                    ].map((social) => (
                      <div key={social.label} className="space-y-2">
                        <label className="text-sm font-bold text-ink">{social.label}</label>
                        <div className="relative">
                          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                            {social.icon}
                          </div>
                          <input 
                            type="text" 
                            value={editForm.social_profiles[social.key as keyof typeof editForm.social_profiles] || ""}
                            onChange={(e) => setEditForm({
                              ...editForm, 
                              social_profiles: {
                                ...editForm.social_profiles, 
                                [social.key]: e.target.value
                              }
                            })}
                            placeholder={social.placeholder}
                            className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {editingSection === "Education Info" && (
                <div className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-ink">Education Level</label>
                    <select
                      value={editForm.education_level}
                      onChange={(e) => setEditForm({...editForm, education_level: e.target.value})}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all appearance-none bg-white"
                    >
                      <option value="">Select education level</option>
                      <option>Primary school leaving certificate</option>
                      <option>Senior Secondary Certificate Exam (SSCE)</option>
                      <option>Ordinary National Diploma (OND)</option>
                      <option>Higher National Diploma (HND)</option>
                      <option>Bachelor's Degree</option>
                      <option>Master's Degree</option>
                      <option>Doctor of Philosophy (PhD)</option>
                      <option>No Education</option>
                    </select>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-ink">Institution</label>
                      <input
                        type="text"
                        value={editForm.institution}
                        onChange={(e) => setEditForm({...editForm, institution: e.target.value})}
                        placeholder="e.g. University of Lagos"
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-ink">Course of Study</label>
                      <input
                        type="text"
                        value={editForm.course_of_study}
                        onChange={(e) => setEditForm({...editForm, course_of_study: e.target.value})}
                        placeholder="e.g. Business Administration"
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-ink">Year of Graduation</label>
                      <input
                        type="text"
                        value={editForm.year_of_graduation}
                        onChange={(e) => setEditForm({...editForm, year_of_graduation: e.target.value})}
                        placeholder="e.g. 2024"
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-ink">Graduation Class</label>
                      <input
                        type="text"
                        value={editForm.graduation_class}
                        onChange={(e) => setEditForm({...editForm, graduation_class: e.target.value})}
                        placeholder="e.g. First Class"
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-ink">NYSC Status</label>
                    <select
                      value={editForm.nysc_completed}
                      onChange={(e) => setEditForm({...editForm, nysc_completed: e.target.value})}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all appearance-none bg-white"
                    >
                      <option value="">Select NYSC status</option>
                      <option>Yes</option>
                      <option>No</option>
                      <option>Exempted</option>
                    </select>
                  </div>
                </div>
              )}

              {editingSection === "Work Info" && (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-ink">Employment Status</label>
                      <select
                        value={editForm.employment_status}
                        onChange={(e) => setEditForm({...editForm, employment_status: e.target.value})}
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all appearance-none bg-white"
                      >
                        <option value="">Select status</option>
                        <option>Employed</option>
                        <option>Unemployed</option>
                        <option>Self-Employed</option>
                        <option>Student</option>
                      </select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-ink">Skill Level</label>
                      <select
                        value={editForm.skill_level}
                        onChange={(e) => setEditForm({...editForm, skill_level: e.target.value})}
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all appearance-none bg-white"
                      >
                        <option value="">Select skill level</option>
                        <option>Beginner</option>
                        <option>Intermediate</option>
                        <option>Advanced</option>
                      </select>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-ink">English Proficiency</label>
                    <select
                      value={editForm.english_proficiency}
                      onChange={(e) => setEditForm({...editForm, english_proficiency: e.target.value})}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all appearance-none bg-white"
                    >
                      <option value="">Select proficiency</option>
                      <option>Beginner</option>
                      <option>Intermediate</option>
                      <option>Advanced</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-ink">Professional Experience</label>
                    <textarea
                      value={editForm.professional_experience}
                      onChange={(e) => setEditForm({...editForm, professional_experience: e.target.value})}
                      placeholder="Describe your experience..."
                      className="w-full h-32 px-4 py-3 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none resize-none transition-all"
                    />
                  </div>
                </div>
              )}

              {editingSection === "Interests" && (
                <div className="space-y-6">
                  <p className="text-sm text-gray-500">Add your interests (comma-separated)</p>
                  <div className="space-y-2">
                    <input 
                      type="text" 
                      value={editForm.interests.join(", ")}
                      onChange={(e) => setEditForm({...editForm, interests: e.target.value.split(",").map(i => i.trim()).filter(i => i)})}
                      placeholder="Enter your interests"
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                    />
                  </div>
                </div>
              )}

              {editingSection === "Current Location" && (
                <div className="space-y-8">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-ink">Country of Origin</label>
                      <div className="relative">
                        <select 
                          value={editForm.country_of_origin}
                          onChange={(e) => handleOriginCountryChange(e.target.value)}
                          className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all appearance-none bg-white"
                        >
                          <option value="">Select country</option>
                          {Country.getAllCountries().map((country: any) => (
                            <option key={country.isoCode} value={country.name}>{country.name}</option>
                          ))}
                        </select>
                        <ChevronDown size={18} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-ink">State of Origin</label>
                      <div className="relative">
                        <select 
                          value={editForm.state_of_origin}
                          onChange={(e) => handleOriginStateChange(e.target.value)}
                          disabled={!editForm.country_of_origin}
                          className={cn(
                            "w-full px-4 py-3 rounded-xl border focus:ring-2 focus:ring-primary/20 outline-none transition-all appearance-none",
                            editForm.country_of_origin ? "border-gray-200 focus:border-primary bg-white" : "border-gray-100 bg-gray-50 cursor-not-allowed"
                          )}
                        >
                          <option value="">{editForm.country_of_origin ? "Select state" : "Select country first"}</option>
                          {originStates.map((state) => {
                            const value = typeof state === "string" ? state : state.name;
                            const key = typeof state === "string" ? state : state.isoCode ?? state.name;
                            return <option key={key} value={value}>{value}</option>;
                          })}
                        </select>
                        <ChevronDown size={18} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-ink">City of Origin</label>
                      <div className="relative">
                        <select 
                          value={editForm.city_of_origin}
                          onChange={(e) => setEditForm({...editForm, city_of_origin: e.target.value})}
                          disabled={!editForm.state_of_origin}
                          className={cn(
                            "w-full px-4 py-3 rounded-xl border focus:ring-2 focus:ring-primary/20 outline-none transition-all appearance-none",
                            editForm.state_of_origin ? "border-gray-200 focus:border-primary bg-white" : "border-gray-100 bg-gray-50 cursor-not-allowed"
                          )}
                        >
                          <option value="">{editForm.state_of_origin ? "Select city" : "Select state first"}</option>
                          {originCities.map((city) => {
                            const value = typeof city === "string" ? city : city.name;
                            return <option key={value} value={value}>{value}</option>;
                          })}
                        </select>
                        <ChevronDown size={18} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-ink">Country of Residence</label>
                      <div className="relative">
                        <select 
                          value={editForm.country_of_residence}
                          onChange={(e) => handleResidenceCountryChange(e.target.value)}
                          className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all appearance-none bg-white"
                        >
                          <option value="">Select country</option>
                          {Country.getAllCountries().map((country: any) => (
                            <option key={country.isoCode} value={country.name}>{country.name}</option>
                          ))}
                        </select>
                        <ChevronDown size={18} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-ink">State of Residence</label>
                      <div className="relative">
                        <select 
                          value={editForm.state_of_residence}
                          onChange={(e) => handleResidenceStateChange(e.target.value)}
                          disabled={!editForm.country_of_residence}
                          className={cn(
                            "w-full px-4 py-3 rounded-xl border focus:ring-2 focus:ring-primary/20 outline-none transition-all appearance-none",
                            editForm.country_of_residence 
                              ? "border-gray-200 focus:border-primary bg-white" 
                              : "border-gray-100 bg-gray-50 cursor-not-allowed"
                          )}
                        >
                          <option value="">
                            {editForm.country_of_residence ? "Select state" : "Select country first"}
                          </option>
                          {residenceStates.map((state) => {
                            const value = typeof state === "string" ? state : state.name;
                            const key = typeof state === "string" ? state : state.isoCode ?? state.name;
                            return <option key={key} value={value}>{value}</option>;
                          })}
                        </select>
                        <ChevronDown size={18} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-ink">City of Residence</label>
                      <div className="relative">
                        <select 
                          value={editForm.city_of_residence}
                          onChange={(e) => setEditForm({...editForm, city_of_residence: e.target.value})}
                          disabled={!editForm.state_of_residence}
                          className={cn(
                            "w-full px-4 py-3 rounded-xl border focus:ring-2 focus:ring-primary/20 outline-none transition-all appearance-none",
                            editForm.state_of_residence 
                              ? "border-gray-200 focus:border-primary bg-white" 
                              : "border-gray-100 bg-gray-50 cursor-not-allowed"
                          )}
                        >
                          <option value="">
                            {editForm.state_of_residence ? "Select city" : "Select state first"}
                          </option>
                          {residenceCities.map((city) => {
                            const value = typeof city === "string" ? city : city.name;
                            return <option key={value} value={value}>{value}</option>;
                          })}
                        </select>
                        <ChevronDown size={18} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="p-6 border-t border-gray-100 flex justify-end gap-4">
              <button 
                onClick={() => setEditingSection(null)}
                className="px-8 py-3 rounded-full border border-primary text-primary font-bold hover:bg-primary/5 transition-colors"
                disabled={isUploading}
              >
                Cancel
              </button>
              <button 
                onClick={handleSaveProfile}
                disabled={isUploading || isSaving}
                className="px-8 py-3 rounded-full bg-primary text-white font-bold hover:bg-primary-light transition-colors shadow-lg shadow-primary/20 disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {isSaving && <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />}
                {isSaving ? "Saving..." : isUploading ? "Uploading..." : "Save Changes"}
              </button>
            </div>
          </motion.div>
        </div>
      </AnimatePresence>
    );
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      {/* Navbar (Mobile matching image) */}
      <nav className="bg-white border-b border-gray-100 px-4 py-3 flex items-center justify-between sticky top-0 z-[50]">
        <div className="flex items-center gap-2 cursor-pointer hover:opacity-80 transition-opacity" onClick={onBack}>
          <BrandLogo wrapperClassName="w-8 h-8 rounded-lg shadow-inner" imgClassName="w-full h-full" />
          <span className="font-display font-bold text-xl tracking-tight text-ink hidden sm:block">
            Paradise <span className="text-primary">Hub</span>
          </span>
        </div>

        <div className="flex items-center gap-3">
          {/* Desktop: Show points, notification, menu, profile */}
          <div className="hidden md:flex items-center gap-3">
            <button
              onClick={onRewardsClick}
              className="flex items-center gap-2 bg-accent/10 border border-accent/20 rounded-full px-4 py-2 hover:bg-accent/15 transition-colors cursor-pointer"
            >
              <div className="w-6 h-6 bg-accent rounded-full flex items-center justify-center text-accent-foreground text-xs font-bold">H</div>
              <span className="font-bold text-sm tracking-tight">{points.toLocaleString()} points</span>
            </button>

            <NotificationBell currentUserId={currentUserId} />
          </div>

          {/* Mobile: Only show menu toggle */}
          <div className="md:hidden relative">
            <button
              onClick={() => {
                setShowQuickActions((prev) => !prev);
                setShowProfileMenu(false);
              }}
              className="p-1.5 rounded-full text-emerald-700 bg-emerald-50 hover:bg-emerald-100 transition-colors"
            >
              <Menu size={20} />
            </button>

            <AnimatePresence>
              {showQuickActions && (
                <>
                  <div
                    className="fixed inset-0 z-40"
                    onClick={() => setShowQuickActions(false)}
                  />
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                    className="absolute right-0 mt-2 w-72 bg-white rounded-2xl shadow-2xl border border-gray-100 p-6 z-50"
                  >
                    <div className="space-y-2">
                      <button
                        onClick={() => {
                          setShowQuickActions(false);
                          onBack();
                        }}
                        className="w-full rounded-2xl px-4 py-3 flex items-center justify-between bg-gray-50 hover:bg-gray-100 transition-colors"
                      >
                        <span className="font-bold text-ink">Dashboard</span>
                      </button>

                      <button
                        onClick={() => {
                          setShowQuickActions(false);
                          onViewLearning();
                        }}
                        className="w-full rounded-2xl px-4 py-3 flex items-center justify-between bg-gray-50 hover:bg-gray-100 transition-colors"
                      >
                        <span className="font-bold text-ink">Learning</span>
                        <GraduationCap size={20} className="text-primary" />
                      </button>

                      <button
                        onClick={() => {
                          setShowQuickActions(false);
                          onViewCommunity();
                        }}
                        className="w-full rounded-2xl px-4 py-3 flex items-center justify-between bg-gray-50 hover:bg-gray-100 transition-colors"
                      >
                        <span className="font-bold text-ink">Incubation</span>
                        <Users size={20} className="text-primary" />
                      </button>

                      <button onClick={() => { setShowQuickActions(false); onRewardsClick(); }} className="w-full rounded-2xl px-4 py-3 flex items-center justify-between bg-gray-50 hover:bg-gray-100 transition-colors">
                        <span className="font-bold text-ink">Rewards</span>
                        <span className="text-sm text-gray-500">{points.toLocaleString()}</span>
                      </button>

                      <button onClick={() => { setShowQuickActions(false); if (onSupportClick) onSupportClick(); }} className="w-full rounded-2xl px-4 py-3 flex items-center justify-between bg-gray-50 hover:bg-gray-100 transition-colors">
                        <span className="font-bold text-ink">Support</span>
                        <HelpCircle size={20} className="text-primary" />
                      </button>

                      <button onClick={() => { setShowQuickActions(false); setShowProfileMenu(true); }} className="w-full rounded-2xl px-4 py-3 flex items-center justify-between bg-gray-50 hover:bg-gray-100 transition-colors">
                        <span className="font-bold text-ink">Profile</span>
                        <User size={20} className="text-primary" />
                      </button>
                    </div>
                  </motion.div>
                </>
              )}
            </AnimatePresence>
          </div>

          {/* Desktop: Menu toggle and profile menu */}
          <div className="hidden md:flex items-center gap-3">
            <div className="h-6 md:h-8 w-px bg-gray-200 mx-1" />

            <div className="relative">
              <button
                onClick={() => {
                  setShowProfileMenu(false);
                  setShowQuickActions((prev) => !prev);
                }}
                className="p-1.5 rounded-full text-emerald-700 bg-emerald-50 hover:bg-emerald-100 transition-colors"
              >
                <Menu size={20} />
              </button>

              <AnimatePresence>
                {showQuickActions && (
                  <>
                    <div
                      className="fixed inset-0 z-40"
                      onClick={() => setShowQuickActions(false)}
                    />
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      transition={{ duration: 0.2 }}
                      className="absolute right-0 mt-2 w-72 bg-white rounded-2xl shadow-2xl border border-gray-100 p-6 z-50"
                    >
                      <div className="grid grid-cols-3 gap-y-8 gap-x-4">
                        <button
                          onClick={() => {
                            setShowQuickActions(false);
                            onViewLearning();
                          }}
                          className="flex flex-col items-center gap-3 group"
                        >
                          <div className="w-12 h-12 rounded-full border border-gray-100 flex items-center justify-center text-gray-600 group-hover:bg-primary/5 group-hover:text-primary group-hover:border-primary/20 transition-all">
                            <GraduationCap size={24} />
                          </div>
                          <span className="text-xs font-medium text-gray-600 group-hover:text-primary">Learning</span>
                        </button>

                        <button
                          onClick={() => {
                            setShowQuickActions(false);
                            onViewCommunity();
                          }}
                          className="flex flex-col items-center gap-3 group"
                        >
                          <div className="w-12 h-12 rounded-full border border-gray-100 flex items-center justify-center text-gray-600 group-hover:bg-primary/5 group-hover:text-primary group-hover:border-primary/20 transition-all">
                            <Users size={24} />
                          </div>
                          <span className="text-xs font-medium text-gray-600 group-hover:text-primary">Incubation</span>
                        </button>

                        <button onClick={() => { setShowQuickActions(false); onRewardsClick(); }} className="flex flex-col items-center gap-3 group">
                          <div className="w-12 h-12 rounded-full border border-gray-100 flex items-center justify-center text-gray-600 group-hover:bg-primary/5 group-hover:text-primary group-hover:border-primary/20 transition-all">
                            <Trophy size={24} />
                          </div>
                          <span className="text-xs font-medium text-gray-600 group-hover:text-primary">Rewards</span>
                        </button>

                        <button onClick={() => { setShowQuickActions(false); if (onSupportClick) onSupportClick(); }} className="flex flex-col items-center gap-3 group">
                          <div className="w-12 h-12 rounded-full border border-gray-100 flex items-center justify-center text-gray-600 group-hover:bg-primary/5 group-hover:text-primary group-hover:border-primary/20 transition-all">
                            <HelpCircle size={24} />
                          </div>
                          <span className="text-xs font-medium text-gray-600 group-hover:text-primary">Support</span>
                        </button>
                      </div>
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>

            <div className="relative">
              <button
                onClick={() => setShowProfileMenu(!showProfileMenu)}
                className="flex items-center gap-2 md:gap-3 group"
              >
                <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold border-2 border-transparent group-hover:border-primary transition-all text-sm md:text-base overflow-hidden">
                  {profile?.avatar_url ? (
                    <img src={profile.avatar_url} alt="Profile" className="w-full h-full object-cover" />
                  ) : (
                    getInitials(profile?.full_name || user?.full_name)
                  )}
                </div>
                <div className="hidden lg:block text-left">
                  <div className="text-sm font-bold text-ink">{profile?.full_name || user?.full_name || "Learner"}</div>
                  <div className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Learner</div>
                </div>
              </button>

              <AnimatePresence>
                {showProfileMenu && (
                  <>
                    <div
                      className="fixed inset-0 z-40"
                      onClick={() => setShowProfileMenu(false)}
                    />
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      transition={{ duration: 0.2 }}
                      className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-2xl border border-gray-100 py-2 z-50 overflow-hidden"
                    >
                      <button
                        onClick={() => {
                          setShowProfileMenu(false);
                          setEditingSection("Basic Info");
                        }}
                        className="w-full px-4 py-3 flex items-center gap-3 hover:bg-gray-50 transition-colors text-ink"
                      >
                        <User size={18} className="text-gray-400" />
                        <span className="text-sm font-bold">Edit profile</span>
                      </button>

                      <button
                        onClick={() => {
                          setShowProfileMenu(false);
                          onViewLearning();
                        }}
                        className="w-full px-4 py-3 flex items-center gap-3 hover:bg-gray-50 transition-colors text-ink"
                      >
                        <GraduationCap size={18} className="text-gray-400" />
                        <span className="text-sm font-bold">My Learning</span>
                      </button>

                      <div className="h-px bg-gray-100 mx-2" />

                      <button
                        onClick={() => {
                          setShowProfileMenu(false);
                          if (onSupportClick) onSupportClick();
                        }}
                        className="w-full px-4 py-3 flex items-center gap-3 hover:bg-gray-50 transition-colors text-ink"
                      >
                        <HelpCircle size={18} className="text-gray-400" />
                        <span className="text-sm font-bold">Support</span>
                      </button>

                      <div className="h-px bg-gray-100 mx-2" />

                      <button
                        onClick={onLogout}
                        className="w-full px-4 py-3 flex items-center gap-3 hover:bg-gray-50 transition-colors text-red-500"
                      >
                        <LogOut size={18} />
                        <span className="text-sm font-bold">Log out</span>
                      </button>
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </nav>

      {/* Header Banner */}
      <div className="relative h-48 md:h-80 bg-gradient-to-r from-primary via-primary-light to-primary overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-0 right-0 w-96 h-96 bg-white/20 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl" />
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-primary-light/20 rounded-full translate-y-1/2 -translate-x-1/2 blur-3xl" />
        </div>
        
        <div className="max-w-[1400px] mx-auto h-full flex items-center px-6 relative">
          <button 
            onClick={onBack}
            className="absolute top-8 left-6 p-2 bg-white/10 hover:bg-white/20 rounded-full text-white transition-colors"
          >
            <ArrowLeft size={20} />
          </button>

          <div className="flex flex-col gap-2">
            <h1 className="text-3xl md:text-6xl font-display font-bold text-white tracking-tight">
              Update Your Paradise Hub Profile
            </h1>
          </div>

          <div className="absolute right-12 bottom-12 opacity-40 hidden lg:block">
            <div className="w-48 h-48 border-4 border-white/20 rounded-3xl rotate-12 flex items-center justify-center">
              <div className="w-32 h-32 border-4 border-white/20 rounded-2xl -rotate-12" />
            </div>
          </div>
        </div>
      </div>

      {/* Profile Info Bar */}
      <div className="max-w-[1400px] mx-auto px-6 -mt-16 relative z-10">
        <div className="flex flex-col md:flex-row items-center md:items-end gap-4 md:gap-6 pb-8">
          <div className="relative group">
            <div className="w-32 h-32 md:w-40 md:h-40 rounded-full bg-white p-1 shadow-xl">
              <div className="w-full h-full rounded-full bg-gray-50 flex flex-col items-center justify-center text-gray-400 border-2 border-dashed border-gray-200 overflow-hidden cursor-pointer hover:border-primary/50 transition-colors" onClick={() => setEditingSection("Basic Info")}>
                {profile?.avatar_url ? (
                  <img src={profile.avatar_url} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  <>
                    <Camera size={32} />
                    <span className="text-[10px] font-bold mt-1">Add Photo</span>
                  </>
                )}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                  <Camera size={24} className="text-white" />
                </div>
              </div>
            </div>
          </div>

          <div className="flex-1 text-center md:text-left">
            <h2 className="text-2xl md:text-3xl font-bold text-ink tracking-tight uppercase">
              {isLoading ? "LOADING..." : profile?.full_name || "LEARNER"}
            </h2>
          </div>

          <div className="flex items-center gap-3">
            <button 
              onClick={() => setEditingSection("Basic Info")}
              className="p-2 border border-gray-200 text-primary rounded-lg hover:bg-gray-50 transition-colors"
            >
              <Edit2 size={18} />
            </button>
          </div>
        </div>

        {/* Referral card */}
        <div className="block mb-6">
          <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-gray-500">Referrals</p>
                <p className="mt-2 text-3xl font-bold text-ink">{referralCount.toLocaleString()}</p>
              </div>
              <button
                onClick={handleCopyLink}
                disabled={!currentUserId}
                className={cn(
                  "px-4 py-2 text-sm font-bold rounded-full transition-all",
                  currentUserId
                    ? copied
                      ? "bg-emerald-500 text-white"
                      : "bg-primary text-white hover:bg-primary-light"
                    : "bg-gray-100 text-gray-500 cursor-not-allowed"
                )}
              >
                {copied ? "Copied" : "Copy link"}
              </button>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex items-center gap-8 border-b border-gray-200 overflow-x-auto no-scrollbar">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={cn(
                "pb-4 text-sm font-bold transition-all relative whitespace-nowrap",
                activeTab === tab ? "text-primary" : "text-gray-400 hover:text-ink"
              )}
            >
              {tab}
              {activeTab === tab && (
                <motion.div 
                  layoutId="activeTab"
                  className="absolute bottom-0 left-0 right-0 h-1 bg-primary rounded-full" 
                />
              )}
            </button>
          ))}
        </div>

        {/* Content Grid */}
        <div className="flex flex-col lg:grid lg:grid-cols-3 gap-8 py-8">
          {/* Sidebar (Completion Card) - COMMENTED OUT */}
          {/* 
          <div className="order-first lg:order-last space-y-8">
            <div className="bg-white rounded-2xl p-6 md:p-8 border border-gray-100 shadow-sm">
              <h3 className="text-lg font-bold text-ink mb-6">Profile Completion</h3>
              
              <div className="flex items-center gap-8">
                <div className="relative w-24 h-24 md:w-32 md:h-32">
                  <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                    <circle 
                      className="text-gray-100" 
                      strokeWidth="10" 
                      stroke="currentColor" 
                      fill="transparent" 
                      r="40" 
                      cx="50" 
                      cy="50" 
                    />
                    <circle 
                      className="text-primary transition-all duration-1000" 
                      strokeWidth="10" 
                      strokeDasharray="251.2"
                      strokeDashoffset={251.2 - (251.2 * profileCompletion) / 100}
                      strokeLinecap="round"
                      stroke="currentColor" 
                      fill="transparent" 
                      r="40" 
                      cx="50" 
                      cy="50" 
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-xl md:text-2xl font-bold text-ink">
                      {profileCompletion}%
                    </span>
                  </div>
                </div>

                <div className="flex-1 space-y-3">
                  {profileSections.map((section) => (
                    <div key={section.label} className="flex items-center gap-3">
                      <div className={cn(
                        "w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors shrink-0",
                        section.completed ? "bg-primary border-primary" : "border-gray-400"
                      )}>
                        {section.completed && <Check size={12} className="text-white" />}
                      </div>
                      <span className="text-sm font-medium text-gray-600 truncate">{section.label}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
          */}

          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6 md:space-y-8">
            {activeTab === "Personal Information" && (
              <>
                <div className="bg-white rounded-2xl p-6 md:p-8 border border-gray-100 shadow-sm relative group">
                  <div className="flex items-center justify-between mb-6 md:mb-8">
                    <h3 className="text-lg font-bold text-ink">About me</h3>
                    <button 
                      onClick={() => setEditingSection("About")}
                      className="p-2 text-gray-400 hover:text-primary transition-colors"
                    >
                      <Edit2 size={18} />
                    </button>
                  </div>

                  {profile?.about_me ? (
                    <p className="text-gray-600 leading-relaxed whitespace-pre-wrap">{profile.about_me}</p>
                  ) : (
                    <div className="flex flex-col items-center justify-center py-8 md:py-12 text-center">
                      <div className="w-20 h-20 md:w-24 md:h-24 bg-gray-50 rounded-full flex items-center justify-center mb-6">
                        <div className="w-14 h-9 md:w-16 md:h-10 border-2 border-gray-200 rounded-lg relative">
                          <div className="absolute top-2 left-2 w-3 h-3 md:w-4 md:h-4 rounded-full bg-gray-200" />
                          <div className="absolute top-2 right-2 w-5 h-1 md:w-6 md:h-1 bg-gray-200" />
                          <div className="absolute top-4 right-2 w-5 h-1 md:w-6 md:h-1 bg-gray-200" />
                          <div className="absolute top-6 right-2 w-5 h-1 md:w-6 md:h-1 bg-gray-200" />
                        </div>
                      </div>
                      <h4 className="text-primary font-bold mb-2">You seem like someone interesting...</h4>
                      <p className="text-sm text-gray-500 mb-8 max-w-xs">Tell us a little about you, your passion, what you live for...</p>
                      <button 
                        onClick={() => setEditingSection("About")}
                        className="w-full md:w-auto px-8 py-3 rounded-full border border-primary text-primary font-bold hover:bg-primary/5 transition-colors"
                      >
                        Add About Me Info
                      </button>
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {/* Languages */}
                  <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-sm font-bold text-ink">Languages</h3>
                      <button 
                        onClick={() => setEditingSection("Languages")}
                        className="p-1.5 text-gray-400 hover:text-primary transition-colors border border-gray-200 rounded-full"
                      >
                        <Plus size={16} />
                      </button>
                    </div>
                    <div className="h-24 flex items-center justify-center">
                      <p className="text-xs text-gray-400">{profile?.languages && profile.languages.length > 0 ? profile.languages.join(', ') : 'No languages added'}</p>
                    </div>
                  </div>

                  {/* Phone Number */}
                  <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-sm font-bold text-ink">Phone Number</h3>
                      <button 
                        onClick={() => setEditingSection("Phone Number")}
                        className="p-1.5 text-gray-400 hover:text-primary transition-colors"
                      >
                        <Edit2 size={16} />
                      </button>
                    </div>
                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-ink">Primary</span>
                        <span className="w-1 h-1 rounded-full bg-gray-300" />
                        <span className="text-sm text-gray-600">{profile?.phone_number || 'Not provided'}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-ink">WhatsApp</span>
                        <span className="w-1 h-1 rounded-full bg-gray-300" />
                        <span className="text-sm text-gray-600">{profile?.whatsapp_number || 'Not provided'}</span>
                      </div>
                    </div>
                  </div>

                  {/* Social Profiles */}
                  <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-sm font-bold text-ink">Social Profiles</h3>
                      <button 
                        onClick={() => setEditingSection("Social Profile")}
                        className="p-1.5 text-gray-400 hover:text-primary transition-colors border border-gray-200 rounded-full"
                      >
                        <Plus size={16} />
                      </button>
                    </div>
                    {profile?.social_profiles && Object.values(profile.social_profiles).some(val => val) ? (
                      <div className="space-y-3">
                        {Object.entries(profile.social_profiles).map(([platform, link]) => {
                          if (!link) return null;
                          return (
                            <div key={platform} className="flex items-center gap-2">
                              <span className="capitalize text-xs font-bold text-ink">{platform}</span>
                              <span className="w-1 h-1 rounded-full bg-gray-300" />
                              <a href={link as string} target="_blank" rel="noreferrer" className="text-primary hover:underline text-sm truncate">Link</a>
                            </div>
                          )
                        })}
                      </div>
                    ) : (
                      <div className="h-24 flex items-center justify-center">
                        <p className="text-xs text-gray-400">No social links added</p>
                      </div>
                    )}
                  </div>

                  {/* Current Location */}
                  <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-sm font-bold text-ink">Current Location</h3>
                      <button 
                        onClick={() => setEditingSection("Current Location")}
                        className="p-1.5 text-gray-400 hover:text-primary transition-colors"
                      >
                        <Edit2 size={16} />
                      </button>
                    </div>
                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-ink">Origin</span>
                        <span className="w-1 h-1 rounded-full bg-gray-300" />
                        <span className="text-sm text-gray-600">{profile?.country_of_origin || 'Not provided'}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-ink">Residence</span>
                        <span className="w-1 h-1 rounded-full bg-gray-300" />
                        <span className="text-sm text-gray-600">{[profile?.city_of_residence, profile?.country_of_residence].filter(Boolean).join(', ') || 'Not provided'}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-2xl p-8 border border-gray-100 shadow-sm">
                  <div className="flex items-center justify-between mb-8">
                    <h3 className="text-lg font-bold text-ink">Interests</h3>
                    <button 
                      onClick={() => setEditingSection("Interests")}
                      className="p-2 text-gray-400 hover:text-primary transition-colors"
                    >
                      <Edit2 size={18} />
                    </button>
                  </div>

                  {profile?.interests && profile.interests.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {profile.interests.map((interest, index) => (
                        <span key={index} className="px-3 py-1 bg-primary/10 text-primary text-sm font-medium rounded-full">
                          {interest}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center py-12 text-center">
                      <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mb-6">
                        <div className="w-16 h-10 border-2 border-gray-200 rounded-lg relative flex items-center justify-center">
                          <Heart size={20} className="text-gray-200" />
                        </div>
                      </div>
                      <h4 className="text-primary font-bold mb-2">What are your interests?</h4>
                      <p className="text-sm text-gray-500 mb-8">Share your interests to boost visibility and attract prospective employers</p>
                      <button 
                        onClick={() => setEditingSection("Interests")}
                        className="px-8 py-3 rounded-full border border-primary text-primary font-bold hover:bg-primary/5 transition-colors"
                      >
                        Add Interests
                      </button>
                    </div>
                  )}
                </div>
              </>
            )}

            {activeTab === "Education Info" && (
              <div className="space-y-6">
                <div className="bg-white rounded-2xl p-6 md:p-8 border border-gray-100 shadow-sm">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-bold text-ink">Education & Academics</h3>
                    <button 
                      onClick={() => setEditingSection("Education Info")}
                      className="px-4 py-2 text-sm font-bold bg-primary/10 text-primary rounded-lg hover:bg-primary/20 transition-colors"
                    >
                      Edit
                    </button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
                    <div><p className="text-gray-400 mb-1">Level</p><p className="font-bold text-ink">{profile?.education_level || editForm.education_level || 'Not provided'}</p></div>
                    <div><p className="text-gray-400 mb-1">Institution</p><p className="font-bold text-ink">{profile?.institution || editForm.institution || 'Not provided'}</p></div>
                    <div><p className="text-gray-400 mb-1">Course of Study</p><p className="font-bold text-ink">{profile?.course_of_study || editForm.course_of_study || 'Not provided'}</p></div>
                    <div><p className="text-gray-400 mb-1">Graduation Year</p><p className="font-bold text-ink">{profile?.year_of_graduation || editForm.year_of_graduation || 'Not provided'}</p></div>
                    <div><p className="text-gray-400 mb-1">Class</p><p className="font-bold text-ink">{profile?.graduation_class || editForm.graduation_class || 'Not provided'}</p></div>
                    <div><p className="text-gray-400 mb-1">NYSC Status</p><p className="font-bold text-ink">{profile?.nysc_completed || editForm.nysc_completed || 'Not provided'}</p></div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "Work Info" && (
              <div className="space-y-6">
                <div className="bg-white rounded-2xl p-6 md:p-8 border border-gray-100 shadow-sm">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-bold text-ink">Work Experience</h3>
                    <button 
                      onClick={() => setEditingSection("Work Info")}
                      className="px-4 py-2 text-sm font-bold bg-primary/10 text-primary rounded-lg hover:bg-primary/20 transition-colors"
                    >
                      Edit
                    </button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
                    <div><p className="text-gray-400 mb-1">Employment Status</p><p className="font-bold text-ink">{profile?.employment_status || editForm.employment_status || 'Not provided'}</p></div>
                    <div><p className="text-gray-400 mb-1">Skill Level</p><p className="font-bold text-ink">{profile?.skill_level || editForm.skill_level || 'Not provided'}</p></div>
                    <div><p className="text-gray-400 mb-1">English Proficiency</p><p className="font-bold text-ink">{profile?.english_proficiency || editForm.english_proficiency || 'Not provided'}</p></div>
                    <div className="md:col-span-2"><p className="text-gray-400 mb-1">Professional Experience</p><p className="font-bold text-ink whitespace-pre-wrap">{profile?.professional_experience || editForm.professional_experience || 'Not provided'}</p></div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "Demographic Info" && (
              <div className="space-y-6">
                <div className="bg-white rounded-2xl p-6 md:p-8 border border-gray-100 shadow-sm">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-bold text-ink">Demographic Information</h3>
                    <button 
                      onClick={() => setEditingSection("Current Location")}
                      className="px-4 py-2 text-sm font-bold bg-primary/10 text-primary rounded-lg hover:bg-primary/20 transition-colors"
                    >
                      Edit
                    </button>
                  </div>
                  <div className="grid grid-cols-1 gap-4 text-sm">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-ink">Origin</span>
                      <span className="w-1 h-1 rounded-full bg-gray-300" />
                      <span className="text-sm text-gray-600">{[profile?.city_of_origin, profile?.state_of_origin, profile?.country_of_origin].filter(Boolean).join(', ') || 'Not provided'}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-ink">Residence</span>
                      <span className="w-1 h-1 rounded-full bg-gray-300" />
                      <span className="text-sm text-gray-600">{[profile?.city_of_residence, profile?.state_of_residence, profile?.country_of_residence].filter(Boolean).join(', ') || 'Not provided'}</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Sidebar (Completion Card) - Moved to main content area for mobile */}
        </div>
      </div>

      {/* Footer */}
      <PageFooter onViewCourseByTitle={onViewCourseByTitle} />

      {renderModal()}
    </div>
  );
}
