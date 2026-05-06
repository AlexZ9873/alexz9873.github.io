function updateScrollProgress() {
    var progressBar = document.getElementById("scroll-progress");
    if (!progressBar) {
        return;
    }

    var scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    var scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
    var progress = scrollHeight > 0 ? (scrollTop / scrollHeight) * 100 : 0;

    progressBar.style.width = progress + "%";
}

function saveContactFormData() {
    var form = document.getElementById("connect-form");
    if (!form) {
        return;
    }

    form.addEventListener("submit", function () {
        var formData = new FormData(form);
        var savedData = {
            name: formData.get("name") || "",
            institution: formData.get("institution") || "",
            email: formData.get("email") || "",
            topic: formData.get("topic") || "",
            note: formData.get("note") || ""
        };

        sessionStorage.setItem("portfolioContactSubmission", JSON.stringify(savedData));
    });
}

function getSubmissionData() {
    var params = new URLSearchParams(window.location.search);
    var data = {
        name: params.get("name") || "",
        institution: params.get("institution") || "",
        email: params.get("email") || "",
        topic: params.get("topic") || "",
        note: params.get("note") || ""
    };

    var hasQueryData = Object.keys(data).some(function (key) {
        return data[key].trim() !== "";
    });

    if (!hasQueryData) {
        try {
            var saved = JSON.parse(sessionStorage.getItem("portfolioContactSubmission"));
            if (saved) {
                data = saved;
            }
        } catch (error) {
            data = {
                name: "",
                institution: "",
                email: "",
                topic: "",
                note: ""
            };
        }
    }

    return data;
}

function setTextIfPresent(id, value) {
    var element = document.getElementById(id);
    if (!element) {
        return;
    }

    element.textContent = value && value.trim() !== "" ? value : "Not provided";
}

function populateConfirmationPage() {
    var summaryName = document.getElementById("summary-name");
    if (!summaryName) {
        return;
    }

    var data = getSubmissionData();

    setTextIfPresent("summary-name", data.name);
    setTextIfPresent("summary-institution", data.institution);
    setTextIfPresent("summary-email", data.email);
    setTextIfPresent("summary-topic", data.topic);
    setTextIfPresent("summary-note", data.note);

    var thankYouName = document.getElementById("thank-you-name");
    if (thankYouName && data.name && data.name.trim() !== "") {
        thankYouName.textContent = ", " + data.name;
    }

    var emailDraftLink = document.getElementById("email-draft-link");
    if (emailDraftLink) {
        var subject = "Portfolio connection from " + (data.name || "website visitor");
        var body = "Name: " + (data.name || "Not provided") + "\n"
            + "Company / Institution: " + (data.institution || "Not provided") + "\n"
            + "Email: " + (data.email || "Not provided") + "\n"
            + "Topic: " + (data.topic || "Not provided") + "\n\n"
            + "Note:\n" + (data.note || "Not provided");

        emailDraftLink.href = "mailto:alexz@usc.edu?subject="
            + encodeURIComponent(subject)
            + "&body="
            + encodeURIComponent(body);
    }
}

document.addEventListener("DOMContentLoaded", function () {
    updateScrollProgress();
    saveContactFormData();
    populateConfirmationPage();
});

window.addEventListener("scroll", updateScrollProgress, { passive: true });
window.addEventListener("resize", updateScrollProgress);
