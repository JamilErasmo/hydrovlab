import React, { createContext, useReducer } from "react";

const initialState = {
	data: null,
	results: {},
	alpha: "0.05",
	dCritical: 0,
	language: "es-EC", // Default to Spanish
};

function reducer(state, action) {
	switch (action.type) {
		case "SET_DATA":
			return { ...state, data: action.payload };
		case "SET_RESULTS":
			return { ...state, results: action.payload };
		case "SET_ALPHA":
			return { ...state, alpha: action.payload };
		case "SET_D_CRITICAL":
			return { ...state, dCritical: action.payload };
		case "CHANGE_LANGUAGE":
			return { ...state, language: action.payload };
		default:
			return state;
	}
}

export const GoodnessOfFitContext = createContext();

export const GoodnessOfFitProvider = ({ children }) => {
	const [state, dispatch] = useReducer(reducer, initialState);

	return (
		<GoodnessOfFitContext.Provider value={{ state, dispatch }}>
			{children}
		</GoodnessOfFitContext.Provider>
	);
};
