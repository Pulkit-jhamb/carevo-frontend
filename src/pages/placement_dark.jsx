import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { API_ENDPOINTS } from '../config';
import axios from 'axios';
import CollegeSidebarDark from './sidebar_college_dark';
import { 
  Search, 
  Settings, 
  Bell, 
  ChevronDown, 
  Filter,
  Building2,
  Users,
  TrendingUp,
  Package,
  DollarSign,
  Calendar,
  MapPin,
  GraduationCap,
  Briefcase,
  CheckCircle,
  ArrowUpDown
} from 'lucide-react';

export default function PlacementDark() {
  const [user, setUser] = useState(null);
  const [userName, setUserName] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [selectedBranch, setSelectedBranch] = useState("None");
  const [cgpaFilter, setCgpaFilter] = useState("8.0");
  const [searchCompany, setSearchCompany] = useState("");
  const [selectedCollege, setSelectedCollege] = useState("Thapar"); // Toggle between Thapar and NSUT
  const navigate = useNavigate();

  const handleToggleTheme = () => {
    navigate("/placement-light");
  };

  useEffect(() => {
    const getUserInfo = async () => {
      try {
        const response = await axios.get(API_ENDPOINTS.AUTH_STATUS);
        if (response.data.authenticated && response.data.user) {
          setUser(response.data.user);
          setUserName(response.data.user.name || "User");
          setUserEmail(response.data.user.email);
        }
      } catch (error) {
        console.error("Failed to get user info:", error);
        navigate("/login");
      }
    };
    getUserInfo();
  }, [navigate]);

  // Thapar placement data
  const thaparStats = {
    totalCompanies: 140,
    avgStipendSecured: "₹50,203",
    avgCTCOffered: "₹14,85,630",
    avgPackageSecured: "₹14,45,809",
    medianPackageSecured: "₹14,00,000",
    studentsSelected: 740
  };

  // NSUT placement data (based on provided image)
  const nsutStats = {
    totalCompanies: 85,
    avgStipendSecured: "₹45,000",
    avgCTCOffered: "₹18,50,000",
    avgPackageSecured: "₹16,25,000",
    medianPackageSecured: "₹15,00,000",
    studentsSelected: 420
  };

  // Current stats based on selected college
  const placementStats = selectedCollege === "Thapar" ? thaparStats : nsutStats;

  // Distribution data for both colleges
  const thaparDistribution = {
    intern: 261,
    fte: 261,
    internPTE: 261
  };

  const nsutDistribution = {
    intern: 180,
    fte: 200,
    internPTE: 40
  };

  const distributionData = selectedCollege === "Thapar" ? thaparDistribution : nsutDistribution;


  const offerTypes = [
    { type: "Intern only", count: 0, ctcRange: "CTC ₹0 - Stipend ₹0" },
    { type: "FTE only (incl. PPO & Intern+PTE)", count: 0, ctcRange: "CTC ₹0 - Stipend ₹0" },
    { type: "Intern + FTE", count: 0, ctcRange: "CTC ₹0 - Stipend ₹0" }
  ];

  // Thapar companies data
  const thaparCompanies = [
    {
      id: 1,
      notificationDate: "13/05/2025",
      companyName: "ZS Associates",
      typeOfOffer: "PPO (Summer Intern/Competition)",
      branchesAllowed: "Not Applicable",
      eligibilityCGPA: "N.A. (via Campus Beats 25)",
      jobRoles: "Decision Analytics",
      ctcStipend: "CTC ₹14,15,600",
      studentsSelected: 3
    },
    {
      id: 2,
      notificationDate: "12/05/2025",
      companyName: "Microsoft",
      typeOfOffer: "FTE",
      branchesAllowed: "CSE, IT, ECE",
      eligibilityCGPA: "8.5+",
      jobRoles: "Software Engineer",
      ctcStipend: "CTC ₹42,00,000",
      studentsSelected: 5
    },
    {
      id: 3,
      notificationDate: "10/05/2025",
      companyName: "Google",
      typeOfOffer: "Intern + FTE",
      branchesAllowed: "All Branches",
      eligibilityCGPA: "8.0+",
      jobRoles: "Software Developer",
      ctcStipend: "CTC ₹55,00,000",
      studentsSelected: 2
    },
    {
      id: 4,
      notificationDate: "08/05/2025",
      companyName: "Amazon",
      typeOfOffer: "FTE",
      branchesAllowed: "CSE, IT",
      eligibilityCGPA: "7.5+",
      jobRoles: "SDE-1",
      ctcStipend: "CTC ₹28,00,000",
      studentsSelected: 8
    },
    {
      id: 5,
      notificationDate: "05/05/2025",
      companyName: "Flipkart",
      typeOfOffer: "Intern",
      branchesAllowed: "CSE, IT, ECE",
      eligibilityCGPA: "7.0+",
      jobRoles: "Software Engineer Intern",
      ctcStipend: "Stipend ₹80,000",
      studentsSelected: 12
    }
  ];

  // NSUT companies data (based on provided image)
  const nsutCompanies = [
    {
      id: 1,
      notificationDate: "Jul/24",
      companyName: "Apple",
      typeOfOffer: "FTE",
      branchesAllowed: "tech",
      eligibilityCGPA: "7.2",
      jobRoles: "SWE",
      ctcStipend: "CTC ₹1,37,000",
      studentsSelected: 7
    },
    {
      id: 2,
      notificationDate: "Jul/24",
      companyName: "Google Silicon",
      typeOfOffer: "FTE",
      branchesAllowed: "core",
      eligibilityCGPA: "6.2",
      jobRoles: "Silicon Eng",
      ctcStipend: "CTC ₹1,14,000",
      studentsSelected: 8
    },
    {
      id: 3,
      notificationDate: "Oct/24",
      companyName: "de shaw",
      typeOfOffer: "FTE-intern",
      branchesAllowed: "tech",
      eligibilityCGPA: "5.5",
      jobRoles: "SDE",
      ctcStipend: "CTC ₹2,00,000",
      studentsSelected: 8
    },
    {
      id: 4,
      notificationDate: "Jul/24",
      companyName: "UBER",
      typeOfOffer: "FTE-intern",
      branchesAllowed: "tech",
      eligibilityCGPA: "5.6",
      jobRoles: "SDE",
      ctcStipend: "CTC ₹1,77,000",
      studentsSelected: 8.5
    },
    {
      id: 5,
      notificationDate: "Jul/24",
      companyName: "zomato",
      typeOfOffer: "FTE-intern",
      branchesAllowed: "tech",
      eligibilityCGPA: "5.6",
      jobRoles: "SDE",
      ctcStipend: "CTC ₹60,000",
      studentsSelected: 6.5
    },
    {
      id: 6,
      notificationDate: "Mar/25",
      companyName: "lti securities HFT",
      typeOfOffer: "FTE",
      branchesAllowed: "tech",
      eligibilityCGPA: "5.4",
      jobRoles: "full stack dev",
      ctcStipend: "CTC ₹1,00,000",
      studentsSelected: 7
    },
    {
      id: 7,
      notificationDate: "Jul/24",
      companyName: "Meesho",
      typeOfOffer: "FTE-intern",
      branchesAllowed: "tech",
      eligibilityCGPA: "4.6",
      jobRoles: "SDE",
      ctcStipend: "CTC ₹1,00,000",
      studentsSelected: 6
    },
    {
      id: 8,
      notificationDate: "Jul/24",
      companyName: "Amazon****",
      typeOfOffer: "FTE-intern",
      branchesAllowed: "tech",
      eligibilityCGPA: "4.5",
      jobRoles: "SDE",
      ctcStipend: "CTC ₹1,10,000",
      studentsSelected: 7
    },
    {
      id: 9,
      notificationDate: "Jul/24",
      companyName: "google",
      typeOfOffer: "FTE",
      branchesAllowed: "tech",
      eligibilityCGPA: "4.4",
      jobRoles: "SWE",
      ctcStipend: "CTC ₹1,14,000",
      studentsSelected: 8
    },
    {
      id: 10,
      notificationDate: "Aug/24",
      companyName: "Tower Research",
      typeOfOffer: "FTE-intern",
      branchesAllowed: "tech",
      eligibilityCGPA: "4.4",
      jobRoles: "SDE",
      ctcStipend: "CTC ₹1,80,000",
      studentsSelected: 8
    }
  ];

  // Current companies data based on selected college
  const allCompaniesData = selectedCollege === "Thapar" ? thaparCompanies : nsutCompanies;
  
  // Filter companies based on search, branch, and CGPA
  const companiesData = allCompaniesData.filter(company => {
    // Search filter
    const matchesSearch = company.companyName.toLowerCase().includes(searchCompany.toLowerCase());
    
    // Branch filter
    let matchesBranch = true;
    if (selectedBranch !== "None") {
      if (selectedCollege === "NSUT") {
        // For NSUT, map branch selections to their data format
        const branchMapping = {
          "CSE": "tech",
          "IT": "tech", 
          "ECE": "core",
          "ME": "core",
          "EE": "core"
        };
        const nsutBranch = branchMapping[selectedBranch];
        if (nsutBranch) {
          matchesBranch = company.branchesAllowed.toLowerCase() === nsutBranch;
        }
      } else {
        // For Thapar, use existing logic
        matchesBranch = company.branchesAllowed.toLowerCase().includes(selectedBranch.toLowerCase()) || 
                       company.branchesAllowed.includes("All Branches");
      }
    }
    
    // CGPA filter
    let matchesCGPA = true;
    if (cgpaFilter && cgpaFilter !== "") {
      const filterCGPA = parseFloat(cgpaFilter);
      if (!isNaN(filterCGPA)) {
        if (selectedCollege === "NSUT") {
          // For NSUT, show companies where user's CGPA >= company's minimum requirement
          const companyCGPA = parseFloat(company.eligibilityCGPA);
          if (!isNaN(companyCGPA)) {
            matchesCGPA = filterCGPA >= companyCGPA;
          }
        } else {
          // For Thapar, keep existing logic
          const companyCGPA = parseFloat(company.eligibilityCGPA);
          if (!isNaN(companyCGPA)) {
            matchesCGPA = companyCGPA <= filterCGPA;
          }
        }
      }
    }
    
    return matchesSearch && matchesBranch && matchesCGPA;
  });

  return (
    <div className="flex bg-black min-h-screen">
      <CollegeSidebarDark isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />
      
      <div className={`flex-1 flex flex-col transition-all duration-300 ${isCollapsed ? 'ml-16' : 'ml-64'}`}>
        <div className="bg-black px-8 py-5 flex items-center justify-between">
          <div className="relative flex-1 max-w-md">
            <input
              type="text"
              placeholder="Search anything"
              className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm text-white placeholder-gray-400"
            />
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={handleToggleTheme}
              className="p-2 rounded-full bg-gray-900 text-white hover:bg-gray-800 transition-colors"
              title="Switch to Light Mode"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clipRule="evenodd" />
              </svg>
            </button>
            <button className="p-2 rounded-lg hover:bg-gray-900 transition-colors">
              <Settings className="w-5 h-5 text-white" />
            </button>
            <button className="p-2 rounded-lg hover:bg-gray-900 transition-colors relative">
              <Bell className="w-5 h-5 text-white" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>
            <div className="flex items-center gap-2 px-3 py-2 bg-gray-900 rounded-lg cursor-pointer hover:bg-gray-800">
              <div className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center">
                <span className="text-white text-sm font-medium">
                  {userName.charAt(0).toUpperCase()}
                </span>
              </div>
              <span className="text-sm font-medium text-white">{userName || 'Harshit Dua'}</span>
              <ChevronDown className="w-4 h-4 text-white" />
            </div>
          </div>
        </div>

        <div className="flex-1 p-6 overflow-y-auto bg-black">
          <div className="max-w-7xl mx-auto space-y-6">
            
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-white flex items-center gap-2">
                  Placements 2025
                  <ChevronDown className="w-6 h-6" />
                </h1>
                <p className="text-gray-400 text-sm mt-1">Last Updated: 10th Oct 2025</p>
              </div>
              
              {/* College Toggle */}
              <div className="flex items-center gap-2 bg-gray-800 rounded-lg p-1">
                <button
                  onClick={() => setSelectedCollege("Thapar")}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                    selectedCollege === "Thapar"
                      ? "bg-gray-700 text-white shadow-sm"
                      : "text-gray-400 hover:text-white"
                  }`}
                >
                  Thapar
                </button>
                <button
                  onClick={() => setSelectedCollege("NSUT")}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                    selectedCollege === "NSUT"
                      ? "bg-gray-700 text-white shadow-sm"
                      : "text-gray-400 hover:text-white"
                  }`}
                >
                  NSUT
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
              <div className="bg-black rounded-lg p-6">
                <div className="flex items-center gap-3 mb-3">
                  <Building2 className="w-5 h-5 text-blue-400" />
                  <span className="text-sm font-medium text-gray-300">Total Unique Companies</span>
                </div>
                <div className="text-3xl font-bold text-white mb-2">{placementStats.totalCompanies}</div>
                <div className="text-xs text-gray-400">
                  <div>On-Campus: 120</div>
                  <div>PPO: 20</div>
                </div>
              </div>

              <div className="bg-black rounded-lg p-6">
                <div className="flex items-center gap-3 mb-3">
                  <TrendingUp className="w-5 h-5 text-green-400" />
                  <span className="text-sm font-medium text-gray-300">Average Stipend Secured</span>
                </div>
                <div className="text-3xl font-bold text-white mb-2">{placementStats.avgStipendSecured}</div>
                <div className="text-xs text-gray-400">Uses Weighted Averages</div>
              </div>

              <div className="bg-black rounded-lg p-6">
                <div className="flex items-center gap-3 mb-3">
                  <Package className="w-5 h-5 text-purple-400" />
                  <span className="text-sm font-medium text-gray-300">Average CTC Offered</span>
                </div>
                <div className="text-3xl font-bold text-white mb-2">{placementStats.avgCTCOffered}</div>
                <div className="text-xs text-gray-400">Uses Non-Weighted Average</div>
              </div>

              <div className="bg-black rounded-lg p-6">
                <div className="flex items-center gap-3 mb-3">
                  <DollarSign className="w-5 h-5 text-orange-400" />
                  <span className="text-sm font-medium text-gray-300">Average Package Secured</span>
                </div>
                <div className="text-3xl font-bold text-white mb-2">{placementStats.avgPackageSecured}</div>
                <div className="text-xs text-gray-400">Uses Weighted Averages</div>
              </div>

              <div className="bg-black rounded-lg p-6">
                <div className="flex items-center gap-3 mb-3">
                  <Users className="w-5 h-5 text-red-400" />
                  <span className="text-sm font-medium text-gray-300">Median Package Secured</span>
                </div>
                <div className="text-3xl font-bold text-white mb-2">{placementStats.medianPackageSecured}</div>
                <div className="text-xs text-gray-400">Uses Weighted Averages</div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-black rounded-lg p-6">
                <div className="flex items-center gap-3 mb-3">
                  <GraduationCap className="w-5 h-5 text-blue-400" />
                  <span className="text-sm font-medium text-gray-300">Students Selected</span>
                </div>
                <div className="text-3xl font-bold text-white mb-2">{placementStats.studentsSelected}</div>
                <div className="text-xs text-gray-400">May include Multiple offers to same person</div>
              </div>

              <div className="bg-black rounded-lg p-6">
                <div className="flex items-center gap-3 mb-3">
                  <Briefcase className="w-5 h-5 text-green-400" />
                  <span className="text-sm font-medium text-gray-300">Distribution (Students)</span>
                </div>
                <div className="grid grid-cols-3 gap-4 mt-4">
                  <div className="text-center">
                    <div className="text-lg font-bold text-white">Intern</div>
                    <div className="text-2xl font-bold text-white">{distributionData.intern}</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-bold text-white">FTE</div>
                    <div className="text-2xl font-bold text-white">{distributionData.fte}</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-bold text-white">Intern/PTE</div>
                    <div className="text-2xl font-bold text-white">{distributionData.internPTE}</div>
                  </div>
                </div>
                <div className="text-xs text-gray-400 mt-2">
                  Intern+FTE (subject to Performance) are considered as Intern Only offers
                </div>
              </div>
            </div>

            <div className="bg-black rounded-lg p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-white">Placements Data</h2>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search company"
                    value={searchCompany}
                    onChange={(e) => setSearchCompany(e.target.value)}
                    className="pl-10 pr-4 py-2 bg-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm text-white placeholder-gray-400"
                  />
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Choose Branch</label>
                  <select 
                    value={selectedBranch}
                    onChange={(e) => setSelectedBranch(e.target.value)}
                    className="w-full px-3 py-2 bg-gray-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm text-white"
                  >
                    <option value="None">— None —</option>
                    {selectedCollege === "NSUT" ? (
                      <>
                        <option value="CSE">Computer Science (Tech)</option>
                        <option value="IT">Information Technology (Tech)</option>
                        <option value="ECE">Electronics & Communication (Core)</option>
                        <option value="ME">Mechanical (Core)</option>
                        <option value="EE">Electrical (Core)</option>
                      </>
                    ) : (
                      <>
                        <option value="CSE">Computer Science</option>
                        <option value="IT">Information Technology</option>
                        <option value="ECE">Electronics & Communication</option>
                        <option value="ME">Mechanical</option>
                        <option value="EE">Electrical</option>
                      </>
                    )}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">CGPA (≥)</label>
                  <input
                    type="text"
                    value={cgpaFilter}
                    onChange={(e) => setCgpaFilter(e.target.value)}
                    className="w-full px-3 py-2 bg-gray-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm text-white placeholder-gray-400"
                    placeholder="8.0"
                  />
                </div>

                <div className="flex items-end">
                  <label className="flex items-center text-sm text-gray-300">
                    <input type="checkbox" className="mr-2" />
                    Apply Branch to types
                  </label>
                </div>

                <div className="flex items-end">
                  <label className="flex items-center text-sm text-gray-300">
                    <input type="checkbox" className="mr-2" />
                    Apply CGPA to types
                  </label>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="bg-gray-900 rounded-lg p-4">
                  <h3 className="font-semibold text-white mb-2">By Offer Type</h3>
                  {offerTypes.map((offer, index) => (
                    <div key={index} className="mb-3">
                      <div className="font-medium text-white">{offer.type}</div>
                      <div className="text-2xl font-bold text-white">{offer.count} companies</div>
                      <div className="text-xs text-gray-400">{offer.ctcRange}</div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="overflow-x-auto -mx-6">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gray-900">
                      <th className="text-left px-6 py-3 text-sm font-medium text-gray-300"># ↑↓</th>
                      <th className="text-left px-6 py-3 text-sm font-medium text-gray-300">Notification Date ↑↓</th>
                      <th className="text-left px-6 py-3 text-sm font-medium text-gray-300">Company Name ↑↓</th>
                      <th className="text-left px-6 py-3 text-sm font-medium text-gray-300">Type of Offer ↑↓</th>
                      <th className="text-left px-6 py-3 text-sm font-medium text-gray-300">Branches Allowed ↑↓</th>
                      <th className="text-left px-6 py-3 text-sm font-medium text-gray-300">Eligibility CGPA ↑↓</th>
                      <th className="text-left px-6 py-3 text-sm font-medium text-gray-300">Job Roles ↑↓</th>
                      <th className="text-left px-6 py-3 text-sm font-medium text-gray-300">CTC/Stipend ↑↓</th>
                      <th className="text-left px-6 py-3 text-sm font-medium text-gray-300">Students Selected ↑↓</th>
                    </tr>
                  </thead>
                  <tbody>
                    {companiesData.map((company, index) => (
                      <tr key={company.id} className="hover:bg-gray-900">
                        <td className="px-6 py-3 text-sm text-white">{index + 1}</td>
                        <td className="px-6 py-3 text-sm text-white">{company.notificationDate}</td>
                        <td className="px-6 py-3 text-sm font-medium text-white">{company.companyName}</td>
                        <td className="px-6 py-3 text-sm text-white">{company.typeOfOffer}</td>
                        <td className="px-6 py-3 text-sm text-white">{company.branchesAllowed}</td>
                        <td className="px-6 py-3 text-sm text-white">{company.eligibilityCGPA}</td>
                        <td className="px-6 py-3 text-sm text-white">{company.jobRoles}</td>
                        <td className="px-6 py-3 text-sm text-white">{company.ctcStipend}</td>
                        <td className="px-6 py-3 text-sm text-center font-medium text-white">{company.studentsSelected}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}