﻿// <auto-generated />
using System;
using Eclipse_Market;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Metadata;
using Microsoft.EntityFrameworkCore.Migrations;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;

#nullable disable

namespace Eclipse_Market.Migrations
{
    [DbContext(typeof(EclipseMarketDbContext))]
    [Migration("20220523200802_Initial")]
    partial class Initial
    {
        protected override void BuildTargetModel(ModelBuilder modelBuilder)
        {
#pragma warning disable 612, 618
            modelBuilder
                .HasAnnotation("ProductVersion", "6.0.5")
                .HasAnnotation("Relational:MaxIdentifierLength", 128);

            SqlServerModelBuilderExtensions.UseIdentityColumns(modelBuilder, 1L, 1);

            modelBuilder.Entity("Eclipse_Market.Models.DB.Listing", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");

                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int>("Id"), 1L, 1);

                    b.Property<int>("AuthorId")
                        .HasColumnType("int");

                    b.Property<string>("Description")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.Property<int>("ListingCategoryId")
                        .HasColumnType("int");

                    b.Property<string>("Location")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.Property<float>("Price")
                        .HasColumnType("real");

                    b.Property<int>("TimesBookmarked")
                        .HasColumnType("int");

                    b.Property<string>("Title")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.Property<int>("Views")
                        .HasColumnType("int");

                    b.HasKey("Id");

                    b.HasIndex("AuthorId");

                    b.HasIndex("ListingCategoryId");

                    b.ToTable("Listings");
                });

            modelBuilder.Entity("Eclipse_Market.Models.DB.ListingCategory", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");

                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int>("Id"), 1L, 1);

                    b.Property<string>("Title")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.HasKey("Id");

                    b.ToTable("ListingCategories");
                });

            modelBuilder.Entity("Eclipse_Market.Models.DB.User", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");

                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int>("Id"), 1L, 1);

                    b.Property<string>("Email")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("FirstName")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("LastName")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.Property<int?>("ListingId")
                        .HasColumnType("int");

                    b.Property<string>("Password")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("PhoneNumber")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("Username")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.HasKey("Id");

                    b.HasIndex("ListingId");

                    b.ToTable("Users");
                });

            modelBuilder.Entity("Eclipse_Market.Models.DB.UserListing", b =>
                {
                    b.Property<int>("UserId")
                        .HasColumnType("int");

                    b.Property<int>("ListingId")
                        .HasColumnType("int");

                    b.HasKey("UserId", "ListingId");

                    b.HasIndex("ListingId");

                    b.ToTable("UserListings");
                });

            modelBuilder.Entity("Eclipse_Market.Models.DB.Listing", b =>
                {
                    b.HasOne("Eclipse_Market.Models.DB.User", "Author")
                        .WithMany("CurrentListings")
                        .HasForeignKey("AuthorId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.HasOne("Eclipse_Market.Models.DB.ListingCategory", "ListingCategory")
                        .WithMany("Listings")
                        .HasForeignKey("ListingCategoryId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("Author");

                    b.Navigation("ListingCategory");
                });

            modelBuilder.Entity("Eclipse_Market.Models.DB.User", b =>
                {
                    b.HasOne("Eclipse_Market.Models.DB.Listing", null)
                        .WithMany("Watchers")
                        .HasForeignKey("ListingId");
                });

            modelBuilder.Entity("Eclipse_Market.Models.DB.UserListing", b =>
                {
                    b.HasOne("Eclipse_Market.Models.DB.Listing", "Listing")
                        .WithMany("UserListings")
                        .HasForeignKey("ListingId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.HasOne("Eclipse_Market.Models.DB.User", "User")
                        .WithMany("FavouriteListings")
                        .HasForeignKey("UserId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("Listing");

                    b.Navigation("User");
                });

            modelBuilder.Entity("Eclipse_Market.Models.DB.Listing", b =>
                {
                    b.Navigation("UserListings");

                    b.Navigation("Watchers");
                });

            modelBuilder.Entity("Eclipse_Market.Models.DB.ListingCategory", b =>
                {
                    b.Navigation("Listings");
                });

            modelBuilder.Entity("Eclipse_Market.Models.DB.User", b =>
                {
                    b.Navigation("CurrentListings");

                    b.Navigation("FavouriteListings");
                });
#pragma warning restore 612, 618
        }
    }
}
