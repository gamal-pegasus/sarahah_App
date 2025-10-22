export const GenderEnum={
    FEMALE:'female',
    MALE:'male'
};

export const RolesEnum={
    USER:'user',
    ADMIN:'admin',
    SUPER_ADMIN:'super_admin'
};

export const privilleges={
    ADMINS:[RolesEnum.ADMIN,RolesEnum.SUPER_ADMIN],
    ADMIN:[RolesEnum.ADMIN],
    USER:[RolesEnum.USER],
    SUPER_ADMIN:[RolesEnum.SUPER_ADMIN],
    ALL:[RolesEnum.ADMIN,RolesEnum.SUPER_ADMIN,RolesEnum.USER],
    USER_ADMIN:[RolesEnum.USER,RolesEnum.ADMIN],
    USER_SUPER_ADMIN:[RolesEnum.USER,RolesEnum.SUPER_ADMIN]
}

export const providerEnum={
    GOOGLE:'google',
    LOCAL:'local'
}