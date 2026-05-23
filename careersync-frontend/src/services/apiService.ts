import api from '@/lib/api';

interface LoginCredentials {
    email: string;
    password: string;
}

interface RegisterData {
    fullName: string;
    email: string;
    password: string;
    role?: string;
}

interface PartnerProfileData {
    bio: string;
    skillsAndExpertise: string[];
    [key: string]: unknown;
}

interface ServiceData {
    name: string;
    description: string;
    category: string;
    price: number;
    duration: number;
    isActive?: boolean;
    [key: string]: unknown;
}

interface BookingData {
    serviceId: string;
    bookingDate: string;
    address: {
        street: string;
        city: string;
        postalCode: string;
    };
    [key: string]: unknown;
}

interface ReviewData {
    bookingId: string;
    rating: number;
    comment: string;
    [key: string]: unknown;
}

interface UserProfileData {
    fullName?: string;
    email?: string;
    phoneNumber?: string;
    [key: string]: unknown;
}

interface StatusUpdate {
    isOnline: boolean;
}

// --- Auth Service ---
export const loginUser = (credentials: LoginCredentials) => {
    return api.post('/auth/login', credentials);
};

export const registerUser = (userData: RegisterData) => {
    return api.post('/auth/register', userData);
};

// --- Company/Recruiter Service ---
export const createPartnerProfile = (profileData: PartnerProfileData) => {
    return api.post('/companies', profileData);
};

export const getPartnerProfile = () => {
    return api.get('/companies/me');
};

export const updatePartnerStatus = (status: StatusUpdate) => {
    return api.patch('/companies/status', status);
};

export const getPartnerServices = () => {
    return api.get('/companies/services');
};

// --- Job Service ---
export const createJob = (jobData: any) => {
    return api.post('/jobs', jobData);
};

export const getAllJobs = () => {
    return api.get('/jobs');
};

export const getJobById = (jobId: string) => {
    return api.get(`/jobs/${jobId}`);
};

export const getJobProviders = (jobName: string) => {
    return api.get(`/jobs/${encodeURIComponent(jobName)}/providers`);
};

export const updateService = (serviceId: string, serviceData: Partial<ServiceData>) => {
    return api.put(`/jobs/${serviceId}`, serviceData);
};

export const deleteService = (serviceId: string) => {
    return api.delete(`/jobs/${serviceId}`);
};

// Aliases for legacy compatibility
export const createService = createJob;
export const getAllServices = getAllJobs;
export const getServiceById = getJobById;
export const getServiceProviders = getJobProviders;

// --- Application Service ---
export const createBooking = (bookingData: BookingData) => {
    return api.post('/applications', bookingData);
};

export const getUserBookings = () => {
    return api.get('/applications/my-bookings');
};

export const cancelBooking = (bookingId: string) => {
    return api.patch(`/applications/${bookingId}/cancel`);
};

export const confirmBooking = (bookingId: string) => {
    return api.patch(`/applications/${bookingId}/confirm`);
};

export const rejectBooking = (bookingId: string, reason?: string) => {
    return api.patch(`/applications/${bookingId}/reject`, { reason });
};

export const updateBookingStatus = (bookingId: string, status: string) => {
    return api.patch(`/applications/${bookingId}/status`, { status });
};

// --- Review Service ---
export const createReview = (reviewData: ReviewData) => {
    return api.post('/reviews', reviewData);
};

export const getServiceReviews = (serviceId: string) => {
    return api.get(`/reviews/service/${serviceId}`);
};

// --- User Profile Service ---
export const getUserProfile = () => {
    return api.get('/users/profile');
};

export const updateUserProfile = (userData: UserProfileData) => {
    return api.put('/users/profile', userData);
};

export const getDashboardStats = () => {
    return api.get('/users/dashboard-stats');
};

// --- AI Service ---
export const getChatResponse = (message: string) => {
    return api.post('/ai/chat', { message });
};

export const generateCoverLetter = (jobId: string) => {
    return api.post('/ai/generate-cover-letter', { jobId });
};

export const generateJD = (jdParams: { title: string; industry?: string; experienceLevel?: string }) => {
    return api.post('/ai/generate-jd', jdParams);
};

export const parseResume = (formData: FormData) => {
    return api.post('/ai/parse-resume', formData);
};
