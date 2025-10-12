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
  const navigate = useNavigate();

  // Theme toggle handler
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

  // Sample placement data
  const placementStats = {
    totalCompanies: 140,
    avgStipendSecured: "₹50,203",
    avgCTCOffered: "₹14,85,630",
    avgPackageSecured: "₹14,45,809",
    medianPackageSecured: "₹14,00,000",
    studentsSelected: 740
  };

  const distributionData = {
    intern: 261,
    fte: 261,
    internPTE: 261
  };

  const eligibilityData = {
    branchEligible: 0,
    cgpaEligible: 0,
    avgStipend: "₹0",
    avgCTC: "₹0"
  };

  const offerTypes = [
    { type: "Intern only", count: 0, ctcRange: "CTC ₹0 - Stipend ₹0" },
    { type: "FTE only (incl. PPO & Intern+PTE)", count: 0, ctcRange: "CTC ₹0 - Stipend ₹0" },
    { type: "Intern + FTE", count: 0, ctcRange: "CTC ₹0 - Stipend ₹0" }
  ];

  // Sample companies data
  const companiesData = [
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

  return (
    <div className="flex bg-black min-h-screen">
      <CollegeSidebarDark isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />
      
      <div className={`flex-1 flex flex-col transition-all duration-300 ${isCollapsed ? 'ml-16' : 'ml-64'}`}>
        {/* Header */}
        <div className="bg-black border-b border-gray-800 px-8 py-5 flex items-center justify-between">
          <div className="relative flex-1 max-w-md">
            <input
              type="text"
              placeholder="Search anything"
              className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-gray-800 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm text-white placeholder-gray-400"
            />
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          </div>
          <div className="flex items-center gap-4">
            {/* Theme toggle button */}
            <button
              onClick={handleToggleTheme}
              className="p-2 rounded-full bg-gray-800 text-white hover:bg-gray-700 transition-colors"
              title="Switch to Light Mode"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clipRule="evenodd" />
              </svg>
            </button>
            <button className="p-2 rounded-lg hover:bg-gray-800 transition-colors">
              <Settings className="w-5 h-5 text-white" />
            </button>
            <button className="p-2 rounded-lg hover:bg-gray-800 transition-colors relative">
              <Bell className="w-5 h-5 text-white" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>
            <div className="flex items-center gap-2 px-3 py-2 bg-black cursor-pointer hover:bg-gray-900">
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

        {/* Main Content */}
        <div className="flex-1 p-6 overflow-y-auto bg-black">
          <div className="max-w-7xl mx-auto space-y-6">
            
            {/* Header Section */}
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-white flex items-center gap-2">
                  Placements 2025
                  <ChevronDown className="w-6 h-6" />
                </h1>
                <p className="text-gray-400 text-sm mt-1">Last Updated: 10th Oct 2025</p>
              </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
              <div className="bg-gray-900 rounded-lg border border-gray-800 p-6">
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

              <div className="bg-gray-900 rounded-lg border border-gray-800 p-6">
                <div className="flex items-center gap-3 mb-3">
                  <TrendingUp className="w-5 h-5 text-green-400" />
                  <span className="text-sm font-medium text-gray-300">Average Stipend Secured</span>
                </div>
                <div className="text-3xl font-bold text-white mb-2">{placementStats.avgStipendSecured}</div>
                <div className="text-xs text-gray-400">Uses Weighted Averages</div>
              </div>

              <div className="bg-gray-900 rounded-lg border border-gray-800 p-6">
                <div className="flex items-center gap-3 mb-3">
                  <Package className="w-5 h-5 text-purple-400" />
                  <span className="text-sm font-medium text-gray-300">Average CTC Offered</span>
                </div>
                <div className="text-3xl font-bold text-white mb-2">{placementStats.avgCTCOffered}</div>
                <div className="text-xs text-gray-400">Uses Non-Weighted Average</div>
              </div>

              <div className="bg-gray-900 rounded-lg border border-gray-800 p-6">
                <div className="flex items-center gap-3 mb-3">
                  <DollarSign className="w-5 h-5 text-orange-400" />
                  <span className="text-sm font-medium text-gray-300">Average Package Secured</span>
                </div>
                <div className="text-3xl font-bold text-white mb-2">{placementStats.avgPackageSecured}</div>
                <div className="text-xs text-gray-400">Uses Weighted Averages</div>
              </div>

              <div className="bg-gray-900 rounded-lg border border-gray-800 p-6">
                <div className="flex items-center gap-3 mb-3">
                  <Users className="w-5 h-5 text-red-400" />
                  <span className="text-sm font-medium text-gray-300">Median Package Secured</span>
                </div>
                <div className="text-3xl font-bold text-white mb-2">{placementStats.medianPackageSecured}</div>
                <div className="text-xs text-gray-400">Uses Weighted Averages</div>
              </div>
            </div>

            {/* Second Row Stats */}
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
              {/* Students Selected */}
              <div className="bg-gray-900 rounded-lg border border-gray-800 p-6">
                <div className="flex items-center gap-3 mb-3">
                  <GraduationCap className="w-5 h-5 text-blue-400" />
                  <span className="text-sm font-medium text-gray-300">Students Selected</span>
                </div>
                <div className="text-3xl font-bold text-white mb-2">{placementStats.studentsSelected}</div>
                <div className="text-xs text-gray-400">May include Multiple offers to same person</div>
              </div>

              {/* Distribution */}
              <div className="bg-gray-900 rounded-lg border border-gray-800 p-6">
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

              {/* Eligibility Filters */}
              <div className="bg-gray-900 rounded-lg border border-gray-800 p-6">
                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-4">Eligibility — Branch</h3>
                    <div className="text-sm text-gray-300 mb-2">Selected: —</div>
                    <div className="text-sm text-gray-300 mb-2">Companies Eligible: {eligibilityData.branchEligible}</div>
                    <div className="text-sm text-gray-300 mb-2">Average CTC: {eligibilityData.avgCTC}</div>
                    <div className="text-sm text-gray-300 mb-2">Average Stipend: {eligibilityData.avgStipend}</div>
                    <div className="text-xs text-gray-400">Unknown branch info: 0</div>
                  </div>
                </div>
              </div>

              <div className="bg-gray-900 rounded-lg border border-gray-800 p-6">
                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-4">Eligibility — CGPA</h3>
                    <div className="text-sm text-gray-300 mb-2">Selected: —</div>
                    <div className="text-sm text-gray-300 mb-2">Companies Eligible: {eligibilityData.cgpaEligible}</div>
                    <div className="text-sm text-gray-300 mb-2">Average CTC: {eligibilityData.avgCTC}</div>
                    <div className="text-sm text-gray-300 mb-2">Average Stipend: {eligibilityData.avgStipend}</div>
                    <div className="text-xs text-gray-400">Unknown CGPA info: 44</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Placements Data Section */}
            <div className="bg-gray-900 rounded-lg border border-gray-800 p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-white">Placements Data</h2>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search company"
                    value={searchCompany}
                    onChange={(e) => setSearchCompany(e.target.value)}
                    className="pl-10 pr-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm text-white placeholder-gray-400"
                  />
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                </div>
              </div>

              {/* Filters */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Choose Branch</label>
                  <select 
                    value={selectedBranch}
                    onChange={(e) => setSelectedBranch(e.target.value)}
                    className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm text-white"
                  >
                    <option value="None">— None —</option>
                    <option value="CSE">Computer Science</option>
                    <option value="IT">Information Technology</option>
                    <option value="ECE">Electronics & Communication</option>
                    <option value="ME">Mechanical</option>
                    <option value="EE">Electrical</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">CGPA (≥)</label>
                  <input
                    type="text"
                    value={cgpaFilter}
                    onChange={(e) => setCgpaFilter(e.target.value)}
                    className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm text-white placeholder-gray-400"
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

              {/* Offer Types */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="bg-gray-800 rounded-lg p-4">
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

              {/* Companies Table */}
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-gray-800 border-b border-gray-700">
                      <th className="text-left p-3 text-sm font-medium text-gray-300"># ↑↓</th>
                      <th className="text-left p-3 text-sm font-medium text-gray-300">Notification Date ↑↓</th>
                      <th className="text-left p-3 text-sm font-medium text-gray-300">Company Name ↑↓</th>
                      <th className="text-left p-3 text-sm font-medium text-gray-300">Type of Offer ↑↓</th>
                      <th className="text-left p-3 text-sm font-medium text-gray-300">Branches Allowed ↑↓</th>
                      <th className="text-left p-3 text-sm font-medium text-gray-300">Eligibility CGPA ↑↓</th>
                      <th className="text-left p-3 text-sm font-medium text-gray-300">Job Roles ↑↓</th>
                      <th className="text-left p-3 text-sm font-medium text-gray-300">CTC/Stipend ↑↓</th>
                      <th className="text-left p-3 text-sm font-medium text-gray-300">Students Selected ↑↓</th>
                    </tr>
                  </thead>
                  <tbody>
                    {companiesData.map((company, index) => (
                      <tr key={company.id} className="border-b border-gray-800 hover:bg-gray-800">
                        <td className="p-3 text-sm text-white">{index + 1}</td>
                        <td className="p-3 text-sm text-white">{company.notificationDate}</td>
                        <td className="p-3 text-sm font-medium text-white">{company.companyName}</td>
                        <td className="p-3 text-sm text-white">{company.typeOfOffer}</td>
                        <td className="p-3 text-sm text-white">{company.branchesAllowed}</td>
                        <td className="p-3 text-sm text-white">{company.eligibilityCGPA}</td>
                        <td className="p-3 text-sm text-white">{company.jobRoles}</td>
                        <td className="p-3 text-sm text-white">{company.ctcStipend}</td>
                        <td className="p-3 text-sm text-center font-medium text-white">{company.studentsSelected}</td>
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
