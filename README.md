# Contacts Feature: Data Management Design

This document outlines the design of the sorting, searching, pagination, and filtering functionality within the contacts feature of the application.

### **Overall Design**

The application's data management is primarily a **server-side** implementation. The client is responsible for managing the user's desired state (e.g., "I want to see page 2, sorted by name") and sending that to the server. The server then performs the actual data manipulation and returns the correctly formatted results.

*   **Client-Side State:** The `useContactsStore` (a Zustand store) is the single source of truth for the current data view. It holds a `query` object that contains all the parameters for the current view:
    *   `search`: The current search term.
    *   `sortBy`, `sortDir`: The current sorting parameters.
    *   `page`, `pageSize`: The current pagination state.
    *   `filters`: An object containing any active filters.
*   **API Layer:** The `useContactsApi` hook acts as the bridge between the client and the server. It reads the `queryParams` from the `useContactsStore` and sends them to the backend with every API request.
*   **Component Layer:** The `ContactsPage.jsx` component is the central orchestrator. It uses the `useContactsQueryState` hook to update the query parameters in the store and has a `useEffect` hook that automatically triggers a data fetch whenever those parameters change.

---

### **1. Sorting**

1.  **Trigger:** The user clicks on a column header in the `ContactsTable` component.
2.  **State Update:** This action calls the `onQueryChange` function in `ContactsPage`. This function updates the `sortBy` and `sortDir` values in the `query` object within the `useContactsStore`.
3.  **API Request:** Because the `query.queryParams` object has changed, the `useEffect` hook in `ContactsPage` is triggered, which in turn calls the `api.fetchContacts()` function.
4.  **Server-Side Logic:** The `fetchContacts` function sends a GET request to the `/api/v1.0/web/notify/contacts` endpoint. The `sortBy` and `sortDir` values are included as URL query parameters. The server is responsible for interpreting these parameters, sorting the data accordingly, and returning the sorted list.
5.  **UI Update:** The client receives the new, sorted data. The `hydrate` action in the `useContactsStore` is called to replace the old data with the new data. The `ContactsTable` component, which is subscribed to the store, automatically re-renders to display the sorted contacts.

### **2. Searching**

1.  **Trigger:** The user types into the search input field located in the `ContactsToolbar`.
2.  **State Update:** The `onQueryChange` function in `ContactsPage` is called, updating the `search` value in the `query` object of the `useContactsStore`.
3.  **API Request:** Just like with sorting, this state change triggers the `useEffect` hook, leading to a new call to `api.fetchContacts()`.
4.  **Server-Side Logic:** The `fetchContacts` function sends the `search` term as a query parameter to the server. The server is responsible for performing the search logic (e.g., a `LIKE` query in a database) and returning only the contacts that match the search term.
5.  **UI Update:** The store is hydrated with the filtered search results, and the `ContactsTable` re-renders to show the new data.

### **3. Pagination**

1.  **Trigger:** The user interacts with the pagination controls at the bottom of the `ContactsTable` (e.g., clicking "next page" or changing the "rows per page" dropdown).
2.  **State Update:** The `onPageChange` or `onPageSizeChange` handlers in `ContactsTable` are called. These functions update the `page` and `pageSize` values in the `query` object of the `useContactsStore`.
3.  **API Request:** The `useEffect` hook is again triggered, causing `api.fetchContacts()` to be called.
4.  **Server-Side Logic:** The `fetchContacts` function sends the `page` and `pageSize` parameters to the server. The server uses these to perform the correct offset and limit on its database query, returning only the records for the requested page. The API response also includes a `nextCursor` for potential cursor-based pagination in the future.
5.  **UI Update:** The store is hydrated with the data for the new page, and the `ContactsTable` re-renders.

### **4. Filtering**

1.  **Trigger:** The user opens the `FilterContactsModal`, selects filter criteria (e.g., by source or tags), and clicks "Apply".
2.  **State Update:** The `onApply` handler in `FilterContactsModal` is called. This updates the `filters` object in the `query` state of the `useContactsStore`.
3.  **API Request:** This triggers the `useEffect` hook and a call to `api.fetchContacts()`.
4.  **Server-Side Logic:** The `fetchContacts` function sends the `filters` object to the server as query parameters. The server is responsible for applying these filters to its query and returning only the matching data.
5.  **UI Update:** The store is hydrated with the filtered data, and the `ContactsTable` re-renders.

### **Design Summary**

| Feature | Primary Logic Location | Client-Side State | Server-Side Responsibility |
| :--- | :--- | :--- | :--- |
| **Sorting** | Server-side | `sortBy`, `sortDir` | Sort the data based on the provided field and direction. |
| **Searching** | Server-side | `search` | Filter the data based on the search term. |
| **Pagination** | Server-side | `page`, `pageSize` | Return the correct slice of data for the requested page. |
| **Filtering** | Server-side | `filters` | Apply the complex filters and return the filtered data. |

This server-centric design is a robust and scalable approach. It ensures that the client application remains fast and responsive, regardless of the size of the contact database, by delegating the intensive data operations to the backend.