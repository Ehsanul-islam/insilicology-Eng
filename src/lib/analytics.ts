/**
 * Analytics Utility
 * 
 * Centralized analytics tracking for Meta Pixel and other analytics platforms
 * Usage: Import and call tracking functions throughout the application
 */

// Meta Pixel ID - Replace with your actual Pixel ID
const META_PIXEL_ID = process.env.VITE_META_PIXEL_ID || '';

// Type definitions for Meta Pixel events
interface MetaPixelEventData {
    content_name?: string;
    content_category?: string;
    content_ids?: string[];
    contents?: Array<{ id: string; quantity: number }>;
    currency?: string;
    value?: number;
    [key: string]: any;
}

declare global {
    interface Window {
        fbq?: (
            action: 'track' | 'trackCustom' | 'init',
            eventName: string,
            data?: MetaPixelEventData
        ) => void;
    }
}

/**
 * Initialize Meta Pixel
 * Call this once when the app loads
 */
export const initMetaPixel = (pixelId: string = META_PIXEL_ID): void => {
    if (!pixelId) {
        console.warn('Meta Pixel ID not configured');
        return;
    }

    // Check if already initialized
    if (window.fbq) {
        console.log('Meta Pixel already initialized');
        return;
    }

    // Meta Pixel base code
    (function (f: any, b: any, e: any, v: any, n?: any, t?: any, s?: any) {
        if (f.fbq) return;
        n = f.fbq = function () {
            n.callMethod ? n.callMethod.apply(n, arguments) : n.queue.push(arguments);
        };
        if (!f._fbq) f._fbq = n;
        n.push = n;
        n.loaded = !0;
        n.version = '2.0';
        n.queue = [];
        t = b.createElement(e);
        t.async = !0;
        t.src = v;
        s = b.getElementsByTagName(e)[0];
        s.parentNode.insertBefore(t, s);
    })(
        window,
        document,
        'script',
        'https://connect.facebook.net/en_US/fbevents.js'
    );

    // Initialize pixel
    window.fbq?.('init', pixelId);
    window.fbq?.('track', 'PageView');

    console.log('✅ Meta Pixel initialized:', pixelId);
};

/**
 * Track page view
 */
export const trackPageView = (): void => {
    if (!window.fbq) return;
    window.fbq('track', 'PageView');
};

/**
 * Track course view
 */
export const trackViewContent = (data: {
    contentName: string;
    contentCategory: string;
    contentId: string;
    value?: number;
}): void => {
    if (!window.fbq) return;

    window.fbq('track', 'ViewContent', {
        content_name: data.contentName,
        content_category: data.contentCategory,
        content_ids: [data.contentId],
        value: data.value,
        currency: 'BDT',
    });
};

/**
 * Track course enrollment initiation
 */
export const trackInitiateCheckout = (data: {
    courseName: string;
    courseId: string;
    value: number;
}): void => {
    if (!window.fbq) return;

    window.fbq('track', 'InitiateCheckout', {
        content_name: data.courseName,
        content_ids: [data.courseId],
        value: data.value,
        currency: 'BDT',
        num_items: 1,
    });
};

/**
 * Track successful enrollment/purchase
 */
export const trackPurchase = (data: {
    courseName: string;
    courseId: string;
    value: number;
    transactionId?: string;
}): void => {
    if (!window.fbq) return;

    window.fbq('track', 'Purchase', {
        content_name: data.courseName,
        content_ids: [data.courseId],
        value: data.value,
        currency: 'BDT',
        num_items: 1,
    });
};

/**
 * Track lead generation (contact form, newsletter signup)
 */
export const trackLead = (data?: {
    contentName?: string;
    contentCategory?: string;
}): void => {
    if (!window.fbq) return;

    window.fbq('track', 'Lead', data);
};

/**
 * Track search
 */
export const trackSearch = (searchQuery: string): void => {
    if (!window.fbq) return;

    window.fbq('track', 'Search', {
        search_string: searchQuery,
    });
};

/**
 * Track custom event
 */
export const trackCustomEvent = (eventName: string, data?: MetaPixelEventData): void => {
    if (!window.fbq) return;

    window.fbq('trackCustom', eventName, data);
};

/**
 * Track add to wishlist
 */
export const trackAddToWishlist = (data: {
    courseName: string;
    courseId: string;
    value?: number;
}): void => {
    if (!window.fbq) return;

    window.fbq('track', 'AddToWishlist', {
        content_name: data.courseName,
        content_ids: [data.courseId],
        value: data.value,
        currency: 'BDT',
    });
};

/**
 * Track registration/signup
 */
export const trackCompleteRegistration = (data?: {
    status?: string;
    value?: number;
}): void => {
    if (!window.fbq) return;

    window.fbq('track', 'CompleteRegistration', data);
};

// Export all tracking functions
export const analytics = {
    init: initMetaPixel,
    pageView: trackPageView,
    viewContent: trackViewContent,
    initiateCheckout: trackInitiateCheckout,
    purchase: trackPurchase,
    lead: trackLead,
    search: trackSearch,
    customEvent: trackCustomEvent,
    addToWishlist: trackAddToWishlist,
    completeRegistration: trackCompleteRegistration,
};

export default analytics;
