import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import TopBar from "../components/layout/TopBar";
import TrendingTable from "../components/trending/TrendingTable";
import { getTrendingTokens } from "../services/api";
import FiltersModal from "../components/modals/FiltersModal";

const PATH_TO_CHAIN_ID = {
  ethereum: "0x1",
  binance: "0x38",
  bsc: "0x38",
  polygon: "0x89",
  solana: "solana",
  arbitrum: "0xa4b1",
  base: "0x2105",
  avalanche: "0xa86a",
  optimism: "0xa",
  linea: "0xe708",
  fantom: "0xfa",
  pulse: "0x171",
  ronin: "0x7e4",
};

const TrendingPage = () => {
  const { chainId } = useParams();
  const [tokens, setTokens] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState("");
  const [sortDirection, setSortDirection] = useState("desc");
  const [isFiltersModalOpen, setFiltersModalOpen] = useState(false);
  const [isFiltered, setIsFiltered] = useState(false);

  const handleApplyFilters = (filteredTokens) => {
    setTokens(filteredTokens);
    setIsFiltered(true);
  };

  useEffect(() => {
    fetchTokens();
  }, [chainId]);

  const fetchTokens = async () => {
    setLoading(true);
    try {
      // Enhanced logging to diagnose chain ID issues
      console.log('Raw URL chainId:', chainId);
      const apiChainId = chainId ? PATH_TO_CHAIN_ID[chainId] || chainId : "";
      console.log(`Converted API Chain ID: ${apiChainId}`);

      const data = await getTrendingTokens(apiChainId);
      setTokens(data);
    } catch (error) {
      console.error("Full Error Details:", error);
      console.error("Error Message:", error.message);
      setTokens([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSortChange = (column) => {
    if (sortBy === column) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortBy(column);
      setSortDirection("desc");
    }
  };

  return (
    <div className="flex flex-col h-full">
      <TopBar
        chainId={chainId}
        isFiltered={isFiltered}
        openFiltersModal={() => setFiltersModalOpen(true)}
        sortBy={sortBy}
        onSortChange={handleSortChange}
      />
      <TrendingTable
        tokens={tokens}
        loading={loading}
        sortBy={sortBy}
        sortDirection={sortDirection}
        onSortChange={handleSortChange}
      />

      <FiltersModal
        isOpen={isFiltersModalOpen}
        onClose={() => setFiltersModalOpen(false)}
        onApplyFilters={handleApplyFilters}
      />
    </div>
  );
};

export default TrendingPage;