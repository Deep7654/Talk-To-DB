interface ApiResponse {
    success: boolean;
    statusCode: number;
    message: string;
    data?: any;
}

class ApiResponse implements ApiResponse {
    constructor(
        public success: boolean, 
        public statusCode: number, 
        public message: string, 
        public data?: any) {
         this.success = success;
         this.message = message;
         this.data = data;  
         this.statusCode = statusCode;
    }
}

export default ApiResponse;