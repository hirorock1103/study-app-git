export type User = {
  // belongCompany: null | {
  //   authType: number;
  //   companyName: string;
  //   companyUserId: number;
  //   icatchImageUrl: string | null;
  //   id: number;
  //   introduceContents: string | null;
  //   introduceTitle: string | null;
  //   photoUrl: string | null;
  //   profileCoverUrl: string | null;
  //   scale: string | null;
  //   uniqueId: string;
  // };
  email: string;
  name: string | null;
  id: number;
  create_at: string;
  update_at: string;
};
