(function () {
  // show/hide toggles
  function $(sel, ctx) {
    return (ctx || document).querySelector(sel);
  }
  function $all(sel, ctx) {
    return Array.from((ctx || document).querySelectorAll(sel));
  }

  document.addEventListener("DOMContentLoaded", function () {
    $all(".pw-toggle").forEach(function (btn) {
      btn.addEventListener("click", function () {
        var targetId = btn.getAttribute("data-target");
        var input = document.getElementById(targetId);
        if (!input) return;
        if (input.type === "password") {
          input.type = "text";
          btn.innerHTML = '<i class="fas fa-eye-slash"></i>';
          btn.setAttribute("aria-label", "Ẩn mật khẩu");
        } else {
          input.type = "password";
          btn.innerHTML = '<i class="fas fa-eye"></i>';
          btn.setAttribute("aria-label", "Hiện mật khẩu");
        }
      });
    });

    var pwInput = $("#new_password");
    var pwConfirm = $("#new_password_confirm");
    var meter = $("#pw-meter");
    var meterBar = meter ? meter.querySelector(".pw-meter-bar") : null;
    var meterText = meter ? meter.querySelector(".pw-meter-text") : null;
    var matchEl = $("#pw-match");

    function scorePassword(pass) {
      // simple scoring: length + variety
      if (!pass) return 0;
      var score = 0;
      score += Math.min(10, pass.length) * 6; // up to 60
      if (/[a-z]/.test(pass)) score += 10;
      if (/[A-Z]/.test(pass)) score += 10;
      if (/[0-9]/.test(pass)) score += 10;
      if (/[^A-Za-z0-9]/.test(pass)) score += 10;
      return Math.min(100, score);
    }

    function updateMeter() {
      if (!pwInput) return;
      var val = pwInput.value || "";
      var s = scorePassword(val);
      if (meterBar) meterBar.style.width = s + "%";
      if (meterText) {
        var label = "Yếu";
        if (s > 80) label = "Rất mạnh";
        else if (s > 60) label = "Mạnh";
        else if (s > 40) label = "Trung bình";
        meterText.textContent = label;
      }
      updateMatch();
    }

    function updateMatch() {
      if (!pwConfirm || !pwInput) return;
      var a = pwInput.value || "";
      var b = pwConfirm.value || "";
      if (!b) {
        matchEl.textContent = "";
        matchEl.style.color = "";
        return;
      }
      if (a === b) {
        matchEl.textContent = "Khớp";
        matchEl.style.color = "green";
      } else {
        matchEl.textContent = "Không khớp";
        matchEl.style.color = "red";
      }
    }

    if (pwInput) {
      pwInput.addEventListener("input", updateMeter);
    }
    if (pwConfirm) {
      pwConfirm.addEventListener("input", updateMatch);
    }
  });
})();
