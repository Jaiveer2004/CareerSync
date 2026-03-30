const fs = require('fs');

const pagePath = '/home/jaiveer/FSE-Project/MERN-Project/Remake/careersync-frontend/src/app/book/[serviceId]/page.tsx';
let content = fs.readFileSync(pagePath, 'utf8');

const regex = /const handleBookingSubmit = async[\s\S]*?toast\.error\(errorMessage\);\s*}/;

const newHandler = `const handleBookingSubmit = async (bookingDetails: BookingDetails) => {
    if (!service) return toast.error("Service details not loaded.");
    if (!selectedProvider) return toast.error("Please select a service provider.");

    const toastId = toast.loading("Submitting your application...");

    try {
      await createBooking({
        ...bookingDetails,
        serviceId: serviceId,
        providerId: selectedProvider._id
      } as any);
      toast.dismiss(toastId);
      toast.success("Application submitted successfully!");
      router.push('/my-bookings');
    } catch (error) {
      console.error("Application submission failed:", error);
      toast.dismiss(toastId);
      const errorMessage = error instanceof Error && 'response' in error && 
        (error as any).response && typeof (error as any).response === 'object' && 
        'data' in (error as any).response && (error as any).response.data && 
        typeof (error as any).response.data === 'object' && 'message' in (error as any).response.data
        ? String((error as any).response.data.message)
        : "Failed to submit application.";
      toast.error(errorMessage);
    }
  }`;

if(content.match(regex)) {
    content = content.replace(regex, newHandler);
    fs.writeFileSync(pagePath, content);
    console.log('Handler updated successfully');
} else {
    console.log('Could not find handler block to replace');
}
