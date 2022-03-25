
// attribution: https://mui.com/components/tabs/#basic-tabs
export function A11yProps(index) {
    return {
        id: `simple-tab-${index}`,
        'aria-controls': `simple-tabpanel-${index}`,
    };
}