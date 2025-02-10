import { useEffect, useState } from "react";

interface SearchBoxProps {
    query: string;
    setQuery: (query: string) => void;
    language: string;
    setLanguage: (language: string) => void;
    onSearch: () => void;
}

const SearchBox: React.FC<SearchBoxProps> = ({
    query,
    setQuery,
    language,
    setLanguage,
    onSearch
}) => {
    const [languages, setLanguages] = useState<string[] | any[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    

    useEffect(() => {
        const fetchLanguages = async () => {
            try {
                setLoading(true);
                const response = await fetch(
                    "https://restcountries.com/v3.1/all"
                );
                if (!response.ok) throw new Error("Failed to fetch languages");
                const data = await response.json();

                // Extract unique languages
                const uniqueLanguages = Array.from(
                    new Set(
                        data.flatMap(
                            (country: {
                                languages?: { [key: string]: string };
                            }) => Object.values(country.languages || {})
                        )
                    )
                ).sort();

                setLanguages(uniqueLanguages);
            } catch (err) {
                setError("Failed to fetch languages.");
            } finally {
                setLoading(false);
            }
        };

        fetchLanguages();
    }, []);
    
    
    return (
        <div className="flex flex-col sm:flex-row justify-between gap-4 mb-6">
            {/* Search Input */}
            <label htmlFor="search-input" className="sr-only">Search</label>
            <input
                id="search-input"

                enterKeyHint="search"
                type="text"
                className="flex-1 p-3 border rounded-md border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Search by name or description"
                value={query}
                onChange={(e)=>setQuery(e.target.value)}
            />

            {/* Language Select */}
            <label htmlFor="language-select" className="sr-only">Select Language</label>
            <select
                id="language-select"

                onChange={e => setLanguage(e.target.value)}
                value={language}
                className="p-3 border rounded-md border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
                <option value="">Select Language</option>

                {/* Display loading state or error */}
                {loading && <option disabled>Loading languages...</option>}
                {error && <option disabled>{error}</option>}

                {/* Display languages */}
                {languages.length === 0 && !loading && !error ? (
                    <option disabled>No languages available</option>
                ) : (
                    languages.map((lang, index) => (
                        <option key={index} value={lang}>
                            {lang}
                        </option>
                    ))
                )}
            </select>
        </div>
    );
};

export default SearchBox;
