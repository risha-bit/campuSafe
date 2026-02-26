const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

export const itemService = {
    getItems: async () => {
        const response = await fetch(`${API_URL}/items`);
        if (!response.ok) throw new Error("Failed to fetch items");
        const data = await response.json();
        return data.map((item: any) => ({ ...item, id: item._id }));
    },

    getItemById: async (id: string) => {
        const response = await fetch(`${API_URL}/items/${id}`);
        if (!response.ok) throw new Error("Failed to fetch item");
        const data = await response.json();
        return { ...data, id: data._id };
    },

    createItem: async (itemData: any) => {
        const response = await fetch(`${API_URL}/items`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(itemData)
        });
        if (!response.ok) throw new Error("Failed to create item");
        const data = await response.json();
        return { ...data, id: data._id };
    },

    claimItem: async (id: string, claimData: any) => {
        const response = await fetch(`${API_URL}/items/${id}/claim`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(claimData)
        });
        if (!response.ok) throw new Error("Failed to claim item");
        const data = await response.json();
        return { ...data, id: data._id };
    },

    updateItemStatus: async (id: string, statusData: { status: string, pickupCode?: string, pickupLocation?: string }) => {
        const response = await fetch(`${API_URL}/items/${id}/status`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(statusData)
        });
        if (!response.ok) throw new Error("Failed to update status");
        const data = await response.json();
        return { ...data, id: data._id };
    }
};
