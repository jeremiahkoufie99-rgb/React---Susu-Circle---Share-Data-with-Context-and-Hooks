import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback
} from "react";

import {
  getMembers,
  getGroups,
  getContributions,
  getPayments,
  createMember
} from "../services/api";

// Create Susu Context
const SusuContext = createContext();

// Create Susu Provider
export const SusuProvider = ({ children }) => {

  const [members, setMembers] = useState([]);
  const [groups, setGroups] = useState([]);
  const [contributions, setContributions] = useState([]);
  const [payments, setPayments] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Fetch all Susu data
  const refreshData = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const [
        membersData,
        groupsData,
        contributionsData,
        paymentsData
      ] = await Promise.all([
        getMembers(),
        getGroups(),
        getContributions(),
        getPayments()
      ]);

      setMembers(membersData);
      setGroups(groupsData);
      setContributions(contributionsData);
      setPayments(paymentsData);

    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  // Load data when the app starts
  useEffect(() => {
    refreshData();
  }, [refreshData]);

  // Add a new member
  const addMember = async (member) => {
    try {
      const newMember = await createMember(member);

      setMembers((prevMembers) => [
        ...prevMembers,
        newMember
      ]);

      return newMember;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  // Share all data
  return (
    <SusuContext.Provider
      value={{
        members,
        groups,
        contributions,
        payments,
        loading,
        error,
        addMember,
        refreshData
      }}
    >
      {children}
    </SusuContext.Provider>
  );
};

// Custom Hook
export const useSusu = () => {
  return useContext(SusuContext);
};