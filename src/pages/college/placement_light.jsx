import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { API_ENDPOINTS } from '../../config';
import axios from 'axios';
import CollegeSidebarLight from './sidebar_college_light';
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

export default function PlacementLight() {
  const [user, setUser] = useState(null);
  const [userName, setUserName] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [selectedBranch, setSelectedBranch] = useState("None");
  const [cgpaFilter, setCgpaFilter] = useState("8.0");
  const [searchCompany, setSearchCompany] = useState("");
  const [selectedCollege, setSelectedCollege] = useState("Thapar"); // Toggle between Thapar and NSUT
  const [sortField, setSortField] = useState("");
  const [sortDirection, setSortDirection] = useState("asc");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const navigate = useNavigate();

  // Theme toggle handler
  const handleToggleTheme = () => {
    navigate("/placement-dark");
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
    },
    {
      id: 11,
      notificationDate: "Jul/24",
      companyName: "microsoft",
      typeOfOffer: "FTE",
      branchesAllowed: "tech",
      eligibilityCGPA: "4.2",
      jobRoles: "SWE",
      ctcStipend: "CTC ₹1,14,000",
      studentsSelected: 7
    },
    {
      id: 12,
      notificationDate: "Aug/24",
      companyName: "intuit",
      typeOfOffer: "FTE",
      branchesAllowed: "tech",
      eligibilityCGPA: "4.0",
      jobRoles: "SWE",
      ctcStipend: "CTC ₹1,14,000",
      studentsSelected: 8
    },
    {
      id: 13,
      notificationDate: "Jul/24",
      companyName: "autodesk",
      typeOfOffer: "FTE-intern",
      branchesAllowed: "tech",
      eligibilityCGPA: "4.0",
      jobRoles: "SDE",
      ctcStipend: "CTC ₹55,000",
      studentsSelected: 7.5
    },
    {
      id: 14,
      notificationDate: "Jul/24",
      companyName: "samsung bangalore",
      typeOfOffer: "FTE",
      branchesAllowed: "tech",
      eligibilityCGPA: "4.0",
      jobRoles: "developer",
      ctcStipend: "CTC ₹1,14,000",
      studentsSelected: 7.5
    },
    {
      id: 15,
      notificationDate: "Jul/24",
      companyName: "atlassian",
      typeOfOffer: "FTE",
      branchesAllowed: "tech",
      eligibilityCGPA: "3.8",
      jobRoles: "SWE",
      ctcStipend: "CTC ₹1,14,000",
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

  // Sorting function
  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
    setCurrentPage(1); // Reset to first page when sorting
  };

  // Sort the filtered data
  const sortedData = [...companiesData].sort((a, b) => {
    if (!sortField) return 0;
    
    let aValue = a[sortField];
    let bValue = b[sortField];
    
    // Handle numeric fields
    if (sortField === "studentsSelected" || sortField === "eligibilityCGPA") {
      aValue = parseFloat(aValue) || 0;
      bValue = parseFloat(bValue) || 0;
    }
    
    // Handle string fields
    if (typeof aValue === "string") {
      aValue = aValue.toLowerCase();
      bValue = bValue.toLowerCase();
    }
    
    if (sortDirection === "asc") {
      return aValue > bValue ? 1 : -1;
    } else {
      return aValue < bValue ? 1 : -1;
    }
  });

  // Pagination
  const totalPages = Math.ceil(sortedData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedData = sortedData.slice(startIndex, endIndex);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  return (
    <div className="flex bg-white min-h-screen">
      <CollegeSidebarLight isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />
      
      <div className={`flex-1 flex flex-col transition-all duration-300 ${isCollapsed ? 'ml-16' : 'ml-64'}`}>
        {/* Header */}
        <div className="bg-white px-8 py-5 flex items-center justify-between">
          <div className="relative flex-1 max-w-md">
            <input
              type="text"
              placeholder="Search anything"
              className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm text-gray-900 placeholder-gray-500"
            />
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          </div>
          <div className="flex items-center gap-4">
            {/* Theme toggle button */}
            <button
              onClick={handleToggleTheme}
              className="p-2 rounded-full bg-gray-100 text-black hover:bg-gray-200 transition-colors"
              title="Switch to Dark Mode"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
              </svg>
            </button>
            <button className="p-2 rounded-lg hover:bg-gray-100 transition-colors">
              <Settings className="w-5 h-5 text-gray-600" />
            </button>
            <button className="p-2 rounded-lg hover:bg-gray-100 transition-colors relative">
              <Bell className="w-5 h-5 text-gray-600" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>
            <div className="flex items-center gap-2 px-3 py-2 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100">
              <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center">
                <span className="text-gray-600 text-sm font-medium">
                  {userName.charAt(0).toUpperCase()}
                </span>
              </div>
              <span className="text-sm font-medium text-gray-900">{userName || 'Harshit Dua'}</span>
              <ChevronDown className="w-4 h-4 text-gray-500" />
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-6 overflow-y-auto bg-white">
          <div className="max-w-7xl mx-auto space-y-6">
            
            {/* Header Section */}
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
                  Placements 2025
                  <ChevronDown className="w-6 h-6" />
                </h1>
                <p className="text-gray-600 text-sm mt-1">Last Updated: 10th Oct 2025</p>
              </div>
              
              {/* College Toggle */}
              <div className="flex items-center gap-2 bg-gray-100 rounded-lg p-1">
                <button
                  onClick={() => setSelectedCollege("Thapar")}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                    selectedCollege === "Thapar"
                      ? "bg-white text-gray-900 shadow-sm"
                      : "text-gray-600 hover:text-gray-900"
                  }`}
                >
                  Thapar
                </button>
                <button
                  onClick={() => setSelectedCollege("NSUT")}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                    selectedCollege === "NSUT"
                      ? "bg-white text-gray-900 shadow-sm"
                      : "text-gray-600 hover:text-gray-900"
                  }`}
                >
                  NSUT
                </button>
              </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-center gap-3 mb-3">
                  <Building2 className="w-5 h-5 text-blue-600" />
                  <span className="text-sm font-medium text-gray-600">Total Unique Companies</span>
                </div>
                <div className="text-3xl font-bold text-gray-900 mb-2">{placementStats.totalCompanies}</div>
                <div className="text-xs text-gray-500">
                  <div>On-Campus: 120</div>
                  <div>PPO: 20</div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-center gap-3 mb-3">
                  <TrendingUp className="w-5 h-5 text-green-600" />
                  <span className="text-sm font-medium text-gray-600">Average Stipend Secured</span>
                </div>
                <div className="text-3xl font-bold text-gray-900 mb-2">{placementStats.avgStipendSecured}</div>
                <div className="text-xs text-gray-500">Uses Weighted Averages</div>
              </div>

              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-center gap-3 mb-3">
                  <Package className="w-5 h-5 text-purple-600" />
                  <span className="text-sm font-medium text-gray-600">Average CTC Offered</span>
                </div>
                <div className="text-3xl font-bold text-gray-900 mb-2">{placementStats.avgCTCOffered}</div>
                <div className="text-xs text-gray-500">Uses Non-Weighted Average</div>
              </div>

              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-center gap-3 mb-3">
                  <DollarSign className="w-5 h-5 text-orange-600" />
                  <span className="text-sm font-medium text-gray-600">Average Package Secured</span>
                </div>
                <div className="text-3xl font-bold text-gray-900 mb-2">{placementStats.avgPackageSecured}</div>
                <div className="text-xs text-gray-500">Uses Weighted Averages</div>
              </div>

              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-center gap-3 mb-3">
                  <Users className="w-5 h-5 text-red-600" />
                  <span className="text-sm font-medium text-gray-600">Median Package Secured</span>
                </div>
                <div className="text-3xl font-bold text-gray-900 mb-2">{placementStats.medianPackageSecured}</div>
                <div className="text-xs text-gray-500">Uses Weighted Averages</div>
              </div>
            </div>

            {/* Second Row Stats */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Students Selected */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-center gap-3 mb-3">
                  <GraduationCap className="w-5 h-5 text-blue-600" />
                  <span className="text-sm font-medium text-gray-600">Students Selected</span>
                </div>
                <div className="text-3xl font-bold text-gray-900 mb-2">{placementStats.studentsSelected}</div>
                <div className="text-xs text-gray-500">May include Multiple offers to same person</div>
              </div>

              {/* Distribution */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-center gap-3 mb-3">
                  <Briefcase className="w-5 h-5 text-green-600" />
                  <span className="text-sm font-medium text-gray-600">Distribution (Students)</span>
                </div>
                <div className="grid grid-cols-3 gap-4 mt-4">
                  <div className="text-center">
                    <div className="text-lg font-bold text-gray-900">Intern</div>
                    <div className="text-2xl font-bold text-gray-900">{distributionData.intern}</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-bold text-gray-900">FTE</div>
                    <div className="text-2xl font-bold text-gray-900">{distributionData.fte}</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-bold text-gray-900">Intern/PTE</div>
                    <div className="text-2xl font-bold text-gray-900">{distributionData.internPTE}</div>
                  </div>
                </div>
                <div className="text-xs text-gray-500 mt-2">
                  Intern+FTE (subject to Performance) are considered as Intern Only offers
                </div>
              </div>
            </div>

            {/* Placements Data Section */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Placements Data</h2>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search company"
                    value={searchCompany}
                    onChange={(e) => setSearchCompany(e.target.value)}
                    className="pl-10 pr-4 py-2 bg-gray-50 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  />
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                </div>
              </div>

              {/* Filters */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Choose Branch</label>
                  <select 
                    value={selectedBranch}
                    onChange={(e) => setSelectedBranch(e.target.value)}
                    className="w-full px-3 py-2 bg-gray-50 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
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
                  <label className="block text-sm font-medium text-gray-700 mb-2">CGPA (≥)</label>
                  <input
                    type="text"
                    value={cgpaFilter}
                    onChange={(e) => setCgpaFilter(e.target.value)}
                    className="w-full px-3 py-2 bg-gray-50 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                    placeholder="8.0"
                  />
                </div>

                <div className="flex items-end">
                  <label className="flex items-center text-sm text-gray-600">
                    <input type="checkbox" className="mr-2" />
                    Apply Branch to types
                  </label>
                </div>

                <div className="flex items-end">
                  <label className="flex items-center text-sm text-gray-600">
                    <input type="checkbox" className="mr-2" />
                    Apply CGPA to types
                  </label>
                </div>
              </div>

              {/* Offer Types */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900 mb-2">By Offer Type</h3>
                  {offerTypes.map((offer, index) => (
                    <div key={index} className="mb-3">
                      <div className="font-medium text-gray-900">{offer.type}</div>
                      <div className="text-2xl font-bold text-gray-900">{offer.count} companies</div>
                      <div className="text-xs text-gray-500">{offer.ctcRange}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Companies Table */}
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="text-left p-3 text-sm font-medium text-gray-700">#</th>
                      <th 
                        className="text-left p-3 text-sm font-medium text-gray-700 cursor-pointer hover:bg-gray-100"
                        onClick={() => handleSort("notificationDate")}
                      >
                        Notification Date {sortField === "notificationDate" ? (sortDirection === "asc" ? "↑" : "↓") : "↑↓"}
                      </th>
                      <th 
                        className="text-left p-3 text-sm font-medium text-gray-700 cursor-pointer hover:bg-gray-100"
                        onClick={() => handleSort("companyName")}
                      >
                        Company Name {sortField === "companyName" ? (sortDirection === "asc" ? "↑" : "↓") : "↑↓"}
                      </th>
                      <th 
                        className="text-left p-3 text-sm font-medium text-gray-700 cursor-pointer hover:bg-gray-100"
                        onClick={() => handleSort("typeOfOffer")}
                      >
                        Type of Offer {sortField === "typeOfOffer" ? (sortDirection === "asc" ? "↑" : "↓") : "↑↓"}
                      </th>
                      <th 
                        className="text-left p-3 text-sm font-medium text-gray-700 cursor-pointer hover:bg-gray-100"
                        onClick={() => handleSort("branchesAllowed")}
                      >
                        Branches Allowed {sortField === "branchesAllowed" ? (sortDirection === "asc" ? "↑" : "↓") : "↑↓"}
                      </th>
                      <th 
                        className="text-left p-3 text-sm font-medium text-gray-700 cursor-pointer hover:bg-gray-100"
                        onClick={() => handleSort("eligibilityCGPA")}
                      >
                        Eligibility CGPA {sortField === "eligibilityCGPA" ? (sortDirection === "asc" ? "↑" : "↓") : "↑↓"}
                      </th>
                      <th 
                        className="text-left p-3 text-sm font-medium text-gray-700 cursor-pointer hover:bg-gray-100"
                        onClick={() => handleSort("jobRoles")}
                      >
                        Job Roles {sortField === "jobRoles" ? (sortDirection === "asc" ? "↑" : "↓") : "↑↓"}
                      </th>
                      <th 
                        className="text-left p-3 text-sm font-medium text-gray-700 cursor-pointer hover:bg-gray-100"
                        onClick={() => handleSort("ctcStipend")}
                      >
                        CTC/Stipend {sortField === "ctcStipend" ? (sortDirection === "asc" ? "↑" : "↓") : "↑↓"}
                      </th>
                      <th 
                        className="text-left p-3 text-sm font-medium text-gray-700 cursor-pointer hover:bg-gray-100"
                        onClick={() => handleSort("studentsSelected")}
                      >
                        Students Selected {sortField === "studentsSelected" ? (sortDirection === "asc" ? "↑" : "↓") : "↑↓"}
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {paginatedData.map((company, index) => (
                      <tr key={company.id} className="hover:bg-gray-50">
                        <td className="p-3 text-sm text-gray-900">{startIndex + index + 1}</td>
                        <td className="p-3 text-sm text-gray-900">{company.notificationDate}</td>
                        <td className="p-3 text-sm font-medium text-gray-900">{company.companyName}</td>
                        <td className="p-3 text-sm text-gray-900">{company.typeOfOffer}</td>
                        <td className="p-3 text-sm text-gray-900">{company.branchesAllowed}</td>
                        <td className="p-3 text-sm text-gray-900">{company.eligibilityCGPA}</td>
                        <td className="p-3 text-sm text-gray-900">{company.jobRoles}</td>
                        <td className="p-3 text-sm text-gray-900">{company.ctcStipend}</td>
                        <td className="p-3 text-sm text-center font-medium text-gray-900">{company.studentsSelected}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-between mt-6">
                  <div className="text-sm text-gray-600">
                    Showing {startIndex + 1} to {Math.min(endIndex, sortedData.length)} of {sortedData.length} companies
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage === 1}
                      className="px-3 py-2 text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Previous
                    </button>
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                      <button
                        key={page}
                        onClick={() => handlePageChange(page)}
                        className={`px-3 py-2 text-sm rounded-lg ${
                          currentPage === page
                            ? "bg-blue-600 text-white"
                            : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                        }`}
                      >
                        {page}
                      </button>
                    ))}
                    <button
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={currentPage === totalPages}
                      className="px-3 py-2 text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Next
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}