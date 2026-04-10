export type Role = 'ROLE_USER' | 'ROLE_ADMIN';
export type Genre = 'ACTION'|'ADVENTURE'|'ANIMATION'|'COMEDY'|'CRIME'|'DOCUMENTARY'|'DRAMA'|'FANTASY'|'HORROR'|'MYSTERY'|'ROMANCE'|'SCI_FI'|'THRILLER'|'WAR'|'WESTERN';
export type SeatStatus = 'AVAILABLE'|'LOCKED'|'BOOKED';
export type BookingStatus = 'PENDING'|'CONFIRMED'|'CANCELLED'|'EXPIRED';
export type PaymentStatus = 'PENDING'|'SUCCESS'|'FAILED'|'REFUNDED';

export interface User { id:number; email:string; firstName:string; lastName:string; phone?:string; role:Role; createdAt:string; }
export interface Movie { id:number; title:string; description?:string; genre:Genre; durationMinutes?:number; rating?:string; imdbRating?:number; language?:string; posterUrl?:string; trailerUrl?:string; releaseDate?:string; director?:string; cast?:string; active:boolean; createdAt:string; }
export interface Theater { id:number; name:string; city:string; address?:string; state?:string; pincode?:string; phone?:string; totalSeats?:number; totalRows?:number; seatsPerRow?:number; active:boolean; createdAt:string; }
export interface Show { id:number; movie:Movie; theater:Theater; showDate:string; showTime:string; ticketPrice:number; active:boolean; availableSeats:number; totalSeats:number; createdAt:string; }
export interface Seat { id:number; rowLabel:string; seatNumber:number; seatLabel:string; status:SeatStatus; }
export interface Booking { id:number; bookingReference:string; show:Show; seats:Seat[]; seatCount:number; totalAmount:number; bookingStatus:BookingStatus; paymentStatus:PaymentStatus; razorpayOrderId?:string; createdAt:string; }

export interface ApiResponse<T> { success:boolean; message:string; data:T; timestamp:string; }
export interface AuthResponse { accessToken:string; tokenType:string; user:User; }
export interface RazorpayOrderResponse { orderId:string; amount:number; currency:string; bookingReference:string; bookingId:number; keyId:string; }

export interface RazorpayPaymentResponse { razorpay_order_id:string; razorpay_payment_id:string; razorpay_signature:string; }
declare global { interface Window { Razorpay: new(o: object) => { open():void; close():void }; } }
