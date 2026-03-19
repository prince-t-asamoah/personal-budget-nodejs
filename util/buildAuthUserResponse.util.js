const buildAuthUserResponse = (userData) => ({
  id: userData.id,
  fullName: userData.fullName,
  email: userData.email,
  phoneNumber: userData.phoneNumber,
  addressDetails: userData.addressDetails,
  profileImageUrl: userData.profileImageUrl,
  isVerified: userData.isVerified,
  createdAt: userData.createdAt,
  updatedAt: userData.updatedAt,
});

module.exports = {
  buildAuthUserResponse,
};
