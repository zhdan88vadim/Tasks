USE [DataServer]
GO
/****** Object:  Table [dbo].[Users]    Script Date: 08/13/2015 17:42:12 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Users](
	[ID] [int] IDENTITY(1,1) NOT NULL,
	[Name] [nvarchar](250) NOT NULL,
	[Phone] [nvarchar](250) NOT NULL,
	[Password] [nvarchar](250) NOT NULL,
	[Email] [nvarchar](250) NOT NULL,
	[Image] [nvarchar](250) NULL,
 CONSTRAINT [PK_Users] PRIMARY KEY CLUSTERED 
(
	[ID] ASC
)WITH (PAD_INDEX  = OFF, STATISTICS_NORECOMPUTE  = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS  = ON, ALLOW_PAGE_LOCKS  = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
SET IDENTITY_INSERT [dbo].[Users] ON
INSERT [dbo].[Users] ([ID], [Name], [Phone], [Password], [Email], [Image]) VALUES (1, N'test user name 1', N'234-23-55', N'password', N'email@gmail.com', N'/Content/UploadedFiles/cd275bdc93f84bb7b9d4a55205b36673_Lighthouse.jpg')
INSERT [dbo].[Users] ([ID], [Name], [Phone], [Password], [Email], [Image]) VALUES (3, N'user name 2', N'567-34-54', N'password', N'email@username3.by', N'/Content/UploadedFiles/5e6da08d3e6046f58674c0552f1f90fb_Koala.jpg')
INSERT [dbo].[Users] ([ID], [Name], [Phone], [Password], [Email], [Image]) VALUES (4, N'user name 4', N'234-34-34', N'P@ssw0rd', N'user4@gmail.com', N'/Content/UploadedFiles/9167f85826fa4f36937981930231e37e_Chrysanthemum.jpg')
INSERT [dbo].[Users] ([ID], [Name], [Phone], [Password], [Email], [Image]) VALUES (5, N'user name 5', N'908-34-32', N'pass', N'user5@gmail.com', N'/Content/UploadedFiles/5deb4c79bb544d8da87250f16c1b9f23_Penguins.jpg')
INSERT [dbo].[Users] ([ID], [Name], [Phone], [Password], [Email], [Image]) VALUES (6, N'user name 6', N'786-34-23', N'pass', N'user6@gmail.com', N'/Content/UploadedFiles/2fe34763c5fc442da35c699c38d555d5_Hydrangeas.jpg')
INSERT [dbo].[Users] ([ID], [Name], [Phone], [Password], [Email], [Image]) VALUES (11, N'user name 6', N'786-34-23', N'pass', N'user6@gmail.com', N'/Content/UploadedFiles/d847bc966fea443b904173e5e8e3a656_Penguins.jpg')
INSERT [dbo].[Users] ([ID], [Name], [Phone], [Password], [Email], [Image]) VALUES (12, N'user 6', N'786-34-23', N'pass', N'user6@gmail.com', N'/Content/UploadedFiles/d6f939688a064f9ea2ee52de90e1fa5f_Lighthouse.jpg')
INSERT [dbo].[Users] ([ID], [Name], [Phone], [Password], [Email], [Image]) VALUES (13, N'user name 13', N'786-34-23', N'pass', N'user6@gmail.com', N'/Content/UploadedFiles/28dc3b5deb8f42409449fd3d271c0d42_Tulips.jpg')
INSERT [dbo].[Users] ([ID], [Name], [Phone], [Password], [Email], [Image]) VALUES (14, N'user name 14', N'786-34-23', N'pass', N'user6@gmail.com', N'/Content/UploadedFiles/cb98fa97421f4750b0228f36a2bf2bb8_Hydrangeas.jpg')
INSERT [dbo].[Users] ([ID], [Name], [Phone], [Password], [Email], [Image]) VALUES (15, N'user name 15', N'786-34-15', N'pass15', N'user15@gmail.com', N'/Content/UploadedFiles/78b6762994c24f5b84aa8dde2aaea375_Jellyfish.jpg')
INSERT [dbo].[Users] ([ID], [Name], [Phone], [Password], [Email], [Image]) VALUES (16, N'user name 6', N'786-34-23', N'pass', N'user6@gmail.com', N'/Content/UploadedFiles/157296c44c054d938cfa5c508f314fc2_Penguins.jpg')
INSERT [dbo].[Users] ([ID], [Name], [Phone], [Password], [Email], [Image]) VALUES (17, N'user name 6', N'786-34-23', N'pass', N'user6@gmail.com', N'/Content/UploadedFiles/28dc3b5deb8f42409449fd3d271c0d42_Tulips.jpg')
INSERT [dbo].[Users] ([ID], [Name], [Phone], [Password], [Email], [Image]) VALUES (18, N'user name 45', N'786-34-23', N'pass44', N'user6@gmail.com', N'/Content/UploadedFiles/28dc3b5deb8f42409449fd3d271c0d42_Tulips.jpg')
INSERT [dbo].[Users] ([ID], [Name], [Phone], [Password], [Email], [Image]) VALUES (19, N'user name 6', N'786-34-23', N'pass', N'user6@gmail.com', N'/Content/UploadedFiles/28dc3b5deb8f42409449fd3d271c0d42_Tulips.jpg')
SET IDENTITY_INSERT [dbo].[Users] OFF
