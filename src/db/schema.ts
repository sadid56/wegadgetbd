/**
 * Modular Schema Index Re-export
 * Schemas have been separated into domain files inside `./schema/`:
 * - `./schema/auth`: user, session, account, verification, roleEnum
 * - `./schema/products`: category, product, productStatusEnum, productLabelEnum
 * - `./schema/orders`: order, orderStatusEnum
 * - `./schema/reviews`: customerReview, reviewStatusEnum
 * - `./schema/finance`: expense, payment, sale, paymentMethodEnum, paymentStatusEnum
 * - `./schema/system`: auditLog, siteSettings, homepageContent, auditActionEnum
 */
export * from "./schema/index";
