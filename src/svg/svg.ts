const svg = {
    dropdown:
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 8" width="16" height="8"><path fill="currentColor" d="M0 1.475l7.396 6.04.596.485.593-.49L16 1.39 14.807 0 7.393 6.122 8.58 6.12 1.186.08z"></path></svg>',
    replay: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 28 28" width="28" height="28"><path fill="none" stroke="currentColor" d="M13.5 20V9l-6 5.5 6 5.5zM21.5 20V9l-6 5.5 6 5.5z"></path></svg>',
    goTo: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 28 28" width="28" height="28"><path fill="currentColor" fill-rule="evenodd" d="M11 4h-1v2H7.5A2.5 2.5 0 0 0 5 8.5V13h1v-2h16v8.5c0 .83-.67 1.5-1.5 1.5H14v1h6.5a2.5 2.5 0 0 0 2.5-2.5v-11A2.5 2.5 0 0 0 20.5 6H18V4h-1v2h-6V4Zm6 4V7h-6v1h-1V7H7.5C6.67 7 6 7.67 6 8.5V10h16V8.5c0-.83-.67-1.5-1.5-1.5H18v1h-1Zm-5.15 10.15-3.5-3.5-.7.7L10.29 18H4v1h6.3l-2.65 2.65.7.7 3.5-3.5.36-.35-.36-.35Z"></path></svg>',
    snapshot:
        '<svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" fill="currentColor"><path fill-rule="evenodd" clip-rule="evenodd" d="M11.118 6a.5.5 0 0 0-.447.276L9.809 8H5.5A1.5 1.5 0 0 0 4 9.5v10A1.5 1.5 0 0 0 5.5 21h16a1.5 1.5 0 0 0 1.5-1.5v-10A1.5 1.5 0 0 0 21.5 8h-4.309l-.862-1.724A.5.5 0 0 0 15.882 6h-4.764zm-1.342-.17A1.5 1.5 0 0 1 11.118 5h4.764a1.5 1.5 0 0 1 1.342.83L17.809 7H21.5A2.5 2.5 0 0 1 24 9.5v10a2.5 2.5 0 0 1-2.5 2.5h-16A2.5 2.5 0 0 1 3 19.5v-10A2.5 2.5 0 0 1 5.5 7h3.691l.585-1.17z"></path><path fill-rule="evenodd" clip-rule="evenodd" d="M13.5 18a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7zm0 1a4.5 4.5 0 1 0 0-9 4.5 4.5 0 0 0 0 9z"></path></svg>',
    settings:
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 28 28" width="28" height="28" fill="currentColor"><path fill-rule="evenodd" d="M18 14a4 4 0 1 1-8 0 4 4 0 0 1 8 0Zm-1 0a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"></path><path fill-rule="evenodd" d="M8.5 5h11l5 9-5 9h-11l-5-9 5-9Zm-3.86 9L9.1 6h9.82l4.45 8-4.45 8H9.1l-4.45-8Z"></path></svg>',
    layout: {
        '1x1': '<svg xmlns="http://www.w3.org/2000/svg" viewBox="-1 -1 21 19" width="21" height="19"><path fill="currentColor" d="M2.5 1C1.67 1 1 1.67 1 2.5v12c0 .83.67 1.5 1.5 1.5h14c.83 0 1.5-.67 1.5-1.5v-12c0-.83-.67-1.5-1.5-1.5h-14ZM0 2.5A2.5 2.5 0 0 1 2.5 0h14A2.5 2.5 0 0 1 19 2.5v12a2.5 2.5 0 0 1-2.5 2.5h-14A2.5 2.5 0 0 1 0 14.5v-12Z"></path></svg>',
        '2x1': '<svg xmlns="http://www.w3.org/2000/svg" viewBox="-1 -1 21 19" width="21" height="19"><path fill="currentColor" fill-rule="evenodd" d="M1 2.5C1 1.67 1.67 1 2.5 1H9v15H2.5A1.5 1.5 0 0 1 1 14.5v-12ZM10 16h6.5c.83 0 1.5-.67 1.5-1.5v-12c0-.83-.67-1.5-1.5-1.5H10v15ZM2.5 0A2.5 2.5 0 0 0 0 2.5v12A2.5 2.5 0 0 0 2.5 17h14a2.5 2.5 0 0 0 2.5-2.5v-12A2.5 2.5 0 0 0 16.5 0h-14Z"></path></svg>',
        '1x2': '<svg xmlns="http://www.w3.org/2000/svg" viewBox="-1 -1 21 19" width="21" height="19"><path fill="currentColor" fill-rule="evenodd" d="M1 2.5C1 1.67 1.67 1 2.5 1h14c.83 0 1.5.67 1.5 1.5V8H1V2.5ZM1 9v5.5c0 .83.67 1.5 1.5 1.5h14c.83 0 1.5-.67 1.5-1.5V9H1Zm1.5-9A2.5 2.5 0 0 0 0 2.5v12A2.5 2.5 0 0 0 2.5 17h14a2.5 2.5 0 0 0 2.5-2.5v-12A2.5 2.5 0 0 0 16.5 0h-14Z"></path></svg>',
        '3x1': '<svg xmlns="http://www.w3.org/2000/svg" viewBox="-1 -1 21 19" width="21" height="19"><path fill="currentColor" fill-rule="evenodd" d="M1 2.5C1 1.67 1.67 1 2.5 1H6v15H2.5A1.5 1.5 0 0 1 1 14.5v-12ZM7 16h5V1H7v15Zm6-15v15h3.5c.83 0 1.5-.67 1.5-1.5v-12c0-.83-.67-1.5-1.5-1.5H13ZM2.5 0A2.5 2.5 0 0 0 0 2.5v12A2.5 2.5 0 0 0 2.5 17h14a2.5 2.5 0 0 0 2.5-2.5v-12A2.5 2.5 0 0 0 16.5 0h-14Z"></path></svg>',
        '2x2': '<svg xmlns="http://www.w3.org/2000/svg" viewBox="-1 -1 21 19" width="21" height="19"><path fill="currentColor" fill-rule="evenodd" d="M1 2.5C1 1.67 1.67 1 2.5 1H9v7H1V2.5ZM1 9v5.5c0 .83.67 1.5 1.5 1.5H9V9H1Zm9 7h6.5c.83 0 1.5-.67 1.5-1.5V9h-8v7Zm8-8V2.5c0-.83-.67-1.5-1.5-1.5H10v7h8ZM2.5 0A2.5 2.5 0 0 0 0 2.5v12A2.5 2.5 0 0 0 2.5 17h14a2.5 2.5 0 0 0 2.5-2.5v-12A2.5 2.5 0 0 0 16.5 0h-14Z"></path></svg>',
    },
    tool: {
        pan: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 28 28" width="28" height="28"><g fill="currentColor"><path d="M18 15h8v-1h-8z"></path><path d="M14 18v8h1v-8zM14 3v8h1v-8zM3 15h8v-1h-8z"></path></g></svg>',
        trendLine:
            '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 28 28" width="28" height="28"><g fill="currentColor" fill-rule="nonzero"><path d="M7.354 21.354l14-14-.707-.707-14 14z"></path><path d="M22.5 7c.828 0 1.5-.672 1.5-1.5s-.672-1.5-1.5-1.5-1.5.672-1.5 1.5.672 1.5 1.5 1.5zm0 1c-1.381 0-2.5-1.119-2.5-2.5s1.119-2.5 2.5-2.5 2.5 1.119 2.5 2.5-1.119 2.5-2.5 2.5zM5.5 24c.828 0 1.5-.672 1.5-1.5s-.672-1.5-1.5-1.5-1.5.672-1.5 1.5.672 1.5 1.5 1.5zm0 1c-1.381 0-2.5-1.119-2.5-2.5s1.119-2.5 2.5-2.5 2.5 1.119 2.5 2.5-1.119 2.5-2.5 2.5z"></path></g></svg>',
        horizontalLine:
            '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 28 28" width="28" height="28"><g fill="currentColor" fill-rule="nonzero"><path d="M4 15h8.5v-1h-8.5zM16.5 15h8.5v-1h-8.5z"></path><path d="M14.5 16c.828 0 1.5-.672 1.5-1.5s-.672-1.5-1.5-1.5-1.5.672-1.5 1.5.672 1.5 1.5 1.5zm0 1c-1.381 0-2.5-1.119-2.5-2.5s1.119-2.5 2.5-2.5 2.5 1.119 2.5 2.5-1.119 2.5-2.5 2.5z"></path></g></svg>',
    },
    cursor: {
        scissor:
            '<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32"><g fill="none" stroke="#111" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="23" r="2.3"/><circle cx="20" cy="23" r="2.3"/><path d="M13.4 21.2 L16 16"/><path d="M18.6 21.2 L16 16"/><path d="M14.2 17.2 L20.2 5.5"/><path d="M17.8 17.2 L11.8 5.5"/></g></svg>',
    },
}

export default svg
