"use client";

import React, { Suspense } from "react";
import { useSearchParams } from "next/navigation";

function ProfileContent() {
  const searchParams = useSearchParams();
  const name = searchParams.get("name") || "Member Name";
  const role = searchParams.get("role") || "Business Designation";
  const img = searchParams.get("img") || "https://placehold.co/400x400/eeeeee/333333?text=Profile+Photo";
  const bio = searchParams.get("bio") || "This is a placeholder for the member's individual business profile. It will highlight their experience, business domain, and contributions to the JCOM Zone network. Connect with this member to explore networking and strategic growth opportunities.";
  const phone = searchParams.get("phone") || "";
  const whatsapp = searchParams.get("whatsapp") || "";
  const company = searchParams.get("company") || "Member's Company Name";
  const industry = searchParams.get("industry") || "Industry/Domain";
  const location = searchParams.get("location") || "City, Country";
  const email = searchParams.get("email") || "info@jcom.org";

  return (
    <div className="container" style={{ marginTop: "150px", marginBottom: "80px", minHeight: "60vh" }}>
      <div className="row">
        <div className="col-lg-4 text-center">
          <img
            src={img}
            className="img-fluid rounded-circle mb-4 shadow object-fit-cover"
            style={{ maxWidth: "250px", height: "250px", width: "250px" }}
            alt={name}
          />
          <h2 className="fw-bold" style={{ color: "#0ea5e9" }}>{name}</h2>
          <p className="text-muted fs-5">{role}</p>
          <div className="d-flex justify-content-center gap-3 mt-4">
            {phone && (
              <a href={`tel:${phone}`} className="btn btn-outline-primary rounded-circle d-flex align-items-center justify-content-center" style={{ width: "45px", height: "45px" }}>
                <i className="bi bi-telephone-fill"></i>
              </a>
            )}
            {whatsapp && (
              <a href={`https://wa.me/${whatsapp.replace(/\+/g, "").replace(/ /g, "")}`} className="btn btn-outline-success rounded-circle d-flex align-items-center justify-content-center" style={{ width: "45px", height: "45px" }}>
                <i className="bi bi-whatsapp"></i>
              </a>
            )}
            <a href={`mailto:${email}`} className="btn btn-outline-info rounded-circle d-flex align-items-center justify-content-center" style={{ width: "45px", height: "45px" }}>
              <i className="bi bi-envelope-fill"></i>
            </a>
          </div>
        </div>
        <div className="col-lg-8 mt-5 mt-lg-0">
          <h3 className="fw-bold mb-4">About Me</h3>
          <p className="text-muted fs-5" style={{ lineHeight: "1.8" }}>
            {bio}
          </p>
          <hr className="my-5" />
          <h3 className="fw-bold mb-4">Business Details</h3>
          <ul className="list-unstyled text-muted fs-5" style={{ lineHeight: "2" }}>
            <li><strong><i className="bi bi-building me-2 text-primary"></i> Company:</strong> {company}</li>
            <li><strong><i className="bi bi-briefcase me-2 text-primary"></i> Industry:</strong> {industry}</li>
            <li><strong><i className="bi bi-geo-alt-fill me-2 text-primary"></i> Location:</strong> {location}</li>
            <li><strong><i className="bi bi-envelope me-2 text-primary"></i> Email:</strong> {email}</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default function ProfilePage() {
  return (
    <Suspense fallback={<div className="container text-center py-5" style={{ marginTop: "150px" }}><div className="spinner-border text-primary" role="status"></div></div>}>
      <ProfileContent />
    </Suspense>
  );
}
