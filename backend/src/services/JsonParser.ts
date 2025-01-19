export default function JsonParser(data: string) {
    try {
        const firstChar = data.trim().charAt(0);
        if (firstChar === '[' || firstChar === '{') {
            return JSON.parse(data);
        }

        const arrayStartIndex = data.indexOf('[');
        const arrayEndIndex = data.indexOf(']');
        
        if (arrayStartIndex === -1 || arrayEndIndex === -1) {
            return data;
        }

        const arrayData = data.substring(arrayStartIndex, arrayEndIndex + 1);
        return JSON.parse(arrayData);
    } catch (error) {
        console.error(error);
    }
}