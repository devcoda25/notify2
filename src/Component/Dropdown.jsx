
import React, { useState } from "react";
import Select, { components } from "react-select";
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import SearchIcon from '@mui/icons-material/Search';

const styles = {

    groupStyles: {
        borderTop: '1px solid rgb(245 246 250)',
        padding: "5px 10px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        color: "black",
        cursor: "pointer",
        fontSize: '0.9rem',
        fontWeight: 'bold',
        padding: '0.8rem 0.7rem',
    },
    icons: {
        color: "black",
        fontSize: "15px"
    },
    optionStyles: {
        padding: '0.8rem 0.7rem',
        fontSize: '12px',
        backgroundColor: 'white',
        borderTop: '1px solid rgb(245 246 250)',
        cursor: 'pointer',
        fontWeight: 500
    },
    groupHeadingHovered: {
        background: "rgb(245 246 250)",
    },
    selectStyles: {
        control: (base, state) => ({
            ...base,
            backgroundColor: state.menuIsOpen ? 'white' : 'rgb(245 246 250)',
            borderColor: state.menuIsOpen || state.isFocused ? 'rgb(232, 234, 242)' : 'transparent',
            boxShadow: state.menuIsOpen || state.isFocused ? 'none' : 'none',
            '&:hover': {
                borderColor: 'none',
            },
        }),
        menu: (base) => ({
            ...base,
            marginTop: '-1px',
            zIndex: 2,
            backgroundColor: "white",
            border: "1px solid rgb(232, 234, 242)",
            borderTop: 'none !important',
            boxShadow: 'rgb(206, 208, 206) 0px 7px 7px 0px',
            borderRadius: "4px",
        }),
        indicatorSeparator: (base) => ({
            ...base,
            display: 'none',
        }),
    },
    placeholderContainer: {
        display: "flex",
        alignItems: "center"
    },
    searchIcon: {
        marginRight: '8px', color: 'gray'
    },
    linkOption: {
        color: 'rgb(14, 113, 195)',
        borderTop: '1px solid rgb(232, 234, 242)',
        fontWeight: "bold",
        padding: "0.8rem 0.7rem",
        cursor: "pointer",
        fontSize: '0.9rem',
        backgroundColor: "white"

    }

};




// Custom Group Heading Component with Tooltip & Toggle Icon
const CustomGroupHeading = ({ data, toggleGroup, expandedGroup }) => {
    const [isHovered, setIsHovered] = useState(false);
    const isExpanded = expandedGroup === data.label;

    return (
        <div
            style={{
                ...styles.groupStyles,
                ...(isHovered && styles.groupHeadingHovered),
            }}
            onClick={() => toggleGroup(data.label)}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            <span>{data.label}</span>
            <span>
                <span style={{ color: "black !important", fontSize: "12px" }}>
                    {isExpanded ? <RemoveIcon style={styles.icons} /> : <AddIcon style={styles.icons} />}</span>
            </span>
        </div>
    );
};

// Custom Group Component
const CustomGroup = (props) => {
    const { data, children, toggleGroup, expandedGroup } = props;
    const isExpanded = expandedGroup === data.label;

    return (
        <div>
            <CustomGroupHeading
                data={data}
                toggleGroup={toggleGroup}
                expandedGroup={expandedGroup}
            />
            {isExpanded && children}
        </div>
    );
};
const CustomOption = (props) => {
    const { data, innerRef, innerProps } = props;
    const [isHovered, setIsHovered] = useState(false);

    // Special styling for "Add New +" option
    if (data.isSpecial) {
        return (
            <div
                ref={innerRef}
                {...innerProps}
                style={styles.linkOption}
            >
                {data.label}
            </div>
        );
    }

    return (
        <div
            ref={innerRef}
            {...innerProps}
            style={{
                ...styles.optionStyles,
                backgroundColor: isHovered ? "rgb(220, 240, 228)" : "white",
            }}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            {data.label}
        </div>
    );
};


// Main Component
const Dropdown = ({ selectLabel, options,disabled}) => {
    const [expandedGroup, setExpandedGroup] = useState(null);
    const [isFocused, setIsFocused] = useState(false);
    const [menuIsOpen, setMenuIsOpen] = useState(false);
    // Toggle Group Visibility
    const toggleGroup = (label) => {
        setExpandedGroup((prev) => (prev === label ? null : label));
    };

    const handleMenuOpen = () => setMenuIsOpen(true);
    const handleMenuClose = () => setMenuIsOpen(false);
    return (
        <div>
            <Select
                options={options}
                isDisabled={disabled}
                components={{
                    Group: (props) => (
                        <CustomGroup
                            {...props}
                            toggleGroup={toggleGroup}
                            expandedGroup={expandedGroup}
                        />
                    ),
                    Option: CustomOption,
                }}
                styles={styles.selectStyles}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                onMenuOpen={handleMenuOpen}
                onMenuClose={handleMenuClose}
                placeholder={
                    menuIsOpen ? (
                        <div style={styles.placeholderContainer}>
                            <SearchIcon style={styles.searchIcon} />
                            Search...
                        </div>
                    ) : (
                        <div> {selectLabel}</div>
                    )
                }
            />
        </div>
    );
};

export default Dropdown;


