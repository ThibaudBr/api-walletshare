classDiagram
direction BT
class card_entity {
   varchar socialName
   boolean isOwnerPro
   varchar firstname
   varchar lastname
   varchar companyName
   text[] phones
   text[] emails
   text[] urls
   timestamp birthday
   text notes
   varchar occupation
   integer numberOfShares
   text[] transferableStatusCardEnum
   text[] whoCanShareCardEnums
   text[] whoCanSeeCardInformationEnums
   text[] whoCanSendMessagesEnums
   timestamp createdAt
   timestamp updatedAt
   timestamp deletedAt
   uuid ownerId
   card_entity_typeofcardenum_enum typeOfCardEnum
   uuid socialNetworkId
   uuid id
}
class card_entity_occupations_occupation {
   uuid cardEntityId
   uuid occupationId
}
class company {
   varchar name
   varchar siret
   varchar banner_url
   varchar description
   varchar website
   varchar address
   varchar zip_code
   varchar city
   varchar country
   varchar phone
   varchar mail
   timestamp createdAt
   timestamp updatedAt
   timestamp deletedAt
   uuid ownerProfileId
   uuid id
}
class node12 {
   text[] roles
   timestamp createdAt
   timestamp updatedAt
   timestamp deletedAt
   uuid companyId
   uuid profileId
   uuid id
}
class company_occupations_occupation {
   uuid companyId
   uuid occupationId
}
class node21 {
   timestamp createdAt
   timestamp updatedAt
   timestamp deletedAt
   uuid conversationId
   uuid cardEntityOneId
   uuid cardEntityTwoId
   uuid id
}
class conversation {
   varchar content
   timestamp createdAt
   timestamp updatedAt
   timestamp deletedAt
   uuid id
}
class discount_codes {
   integer discount_percentage
   integer discount_amount
   date start_date
   date end_date
   integer usage_limit
   timestamp createdAt
   timestamp updatedAt
   timestamp deletedAt
   uuid id
}
class discount_codes_subscriptions_subscription_entity {
   uuid discountCodesId
   uuid subscriptionEntityId
}
class group_entity {
   varchar name
   timestamp createdAt
   timestamp updatedAt
   timestamp deletedAt
   uuid pictureId
   uuid bannerPictureId
   uuid id
}
class group_membership_entity {
   timestamp createdAt
   timestamp updatedAt
   timestamp deletedAt
   uuid cardId
   uuid groupId
   text[] role
   uuid id
}
class invoices {
   integer amount
   varchar(255) currency
   varchar(255) invoice_number
   varchar(255) company_name
   varchar(255) company_address
   varchar(255) company_vat_number
   varchar(255) client_name
   varchar(255) client_address
   varchar(255) client_vat_number
   varchar(255) description
   numeric tax_rate
   numeric total_tax
   numeric total_amount
   numeric discount_amount
   timestamp createdAt
   timestamp updatedAt
   timestamp deletedAt
   uuid subscriptionId
   uuid id
}
class joined_conversation {
   varchar socketId
   timestamp createdAt
   timestamp updatedAt
   timestamp deletedAt
   uuid profileId
   uuid conversationId
   uuid id
}
class media_entity {
   varchar key
   timestamp createdAt
   timestamp updatedAt
   timestamp deletedAt
   uuid id
}
class message_entity {
   varchar content
   timestamp createdAt
   timestamp updatedAt
   timestamp deletedAt
   uuid authorId
   uuid conversationId
   uuid id
}
class occupation {
   varchar name
   timestamp createdAt
   timestamp updatedAt
   timestamp deletedAt
   uuid id
}
class plan {
   varchar(255) name
   varchar(255) description
   double precision price
   integer duration
   double precision discounted_price
   timestamp createdAt
   timestamp updatedAt
   timestamp deletedAt
   uuid id
}
class profile {
   timestamp createdAt
   timestamp updatedAt
   timestamp deletedAt
   uuid id
   uuid id
}
class node14 {
   uuid profile_id
   uuid occupation_id
}
class node9 {
   uuid profile_id
   uuid card_id
}
class social_network_entity {
   varchar name
   varchar url
   varchar icon
   timestamp createdAt
   timestamp updatedAt
   timestamp deletedAt
   uuid id
}
class strip_event {
   integer id
}
class subscription_entity {
   date start_date
   date end_date
   varchar stripCustomerId
   date trial_start_date
   date trial_end_date
   timestamp createdAt
   timestamp updatedAt
   timestamp deletedAt
   uuid planId
   uuid id
   uuid id
}
class user {
   varchar mail
   boolean isEmailConfirmed
   varchar username
   varchar password
   boolean isRegisteredWithGoogle
   text[] userRoles
   timestamp createdAt
   timestamp updatedAt
   timestamp deletedAt
   uuid id
}

card_entity  -->  profile : ownerId:id
card_entity  -->  social_network_entity : socialNetworkId:id
card_entity_occupations_occupation  -->  card_entity : cardEntityId:id
card_entity_occupations_occupation  -->  occupation : occupationId:id
company  -->  profile : ownerProfileId:id
node12  -->  company : companyId:id
node12  -->  profile : profileId:id
company_occupations_occupation  -->  company : companyId:id
company_occupations_occupation  -->  occupation : occupationId:id
node21  -->  card_entity : cardEntityOneId:id
node21  -->  card_entity : cardEntityTwoId:id
node21  -->  conversation : conversationId:id
discount_codes_subscriptions_subscription_entity  -->  discount_codes : discountCodesId:id
discount_codes_subscriptions_subscription_entity  -->  subscription_entity : subscriptionEntityId:id
group_entity  -->  media_entity : pictureId:id
group_entity  -->  media_entity : bannerPictureId:id
group_membership_entity  -->  card_entity : cardId:id
group_membership_entity  -->  group_entity : groupId:id
invoices  -->  subscription_entity : subscriptionId:id
joined_conversation  -->  conversation : conversationId:id
joined_conversation  -->  profile : profileId:id
message_entity  -->  card_entity : authorId:id
message_entity  -->  conversation : conversationId:id
profile  -->  user : id:id
node14  -->  occupation : occupation_id:id
node14  -->  profile : profile_id:id
node9  -->  card_entity : card_id:id
node9  -->  profile : profile_id:id
subscription_entity  -->  plan : planId:id
subscription_entity  -->  user : id:id
