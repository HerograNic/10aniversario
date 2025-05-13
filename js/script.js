$(document).ready(function ()
{
  const $cedula = $("#cedula");
  const $correo = $("#correo");
  const $form = $("#formregistro");
  const $cedacompanante = $("#cedacompanante");

    // Función para verificar duplicado
  function verificarCedula(cedula)
  {
    return fetch("https://prod-141.westus.logic.azure.com:443/workflows/2bf9e866080f48f5ac2bbcbf5ea45d99/triggers/manual/paths/invoke?api-version=2016-06-01&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=IvODJiy5VGeYUL05JumEDehb89RkwskMwWDaCqCAvOI", {
      method: "POST",
      headers:
      {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ Cedula: cedula })
    })
    .then(res => res.json())
    .then(data => data.existe);
  }

   // Función para enviar el formulario si no hay duplicado
  function enviarFormulario(data)
  {
    fetch("https://prod-27.westus.logic.azure.com:443/workflows/38968b7e935f489790cdcdcf9c6c3311/triggers/manual/paths/invoke?api-version=2016-06-01&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=ro5qRj0lM92Z6d2DD-cD04md-ARb6wzc7dKrhKmzepE", {
      method: "POST",
      headers:
      {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(data)
    })
    .then(response =>
      {
        if (response.ok)
          {
            $form[0].reset();
            bootbox.alert(
              {
                title: "Éxito",
                message: "El Formulario Fue Enviado Correctamente.",
                backdrop: true,
                callback: function () {
                  $(".form-container").html(`
      <div class="text-center text-white">
        <h3 class="mb-4">¡Gracias por Registrarte!</h3>
        <p class="fs-5">Esperamos Contar con su Presencia en el Evento.</p>
        <p class="fs-5">📍 Hotel DoubleTree by Hilton, Managua</p>
        <p class="fs-5">📅 Sábado 24 de mayo de 2025 | 🕑 2:00 p.m.</p>
        <div class="ratio ratio-16x9 mt-4 rounded overflow-hidden shadow">
          <iframe 
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d31209.1994112734!2d-86.29104944207724!3d12.101886896872339!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8f7155b7470be48f%3A0xe2660e65468acf6e!2sDoubleTree%20by%20Hilton%20Managua!5e0!3m2!1ses-419!2sni!4v1747158239959!5m2!1ses-419!2sni" 
            width="100%" 
            height="100%" 
            style="border:0;" 
            allowfullscreen="" 
            loading="lazy" 
            referrerpolicy="no-referrer-when-downgrade"></iframe>
        </div>
      </div>
    `);
     $("header").hide();
  }
              });
        setTimeout(() => {
          $('.bootbox.modal .modal-content .modal-header').addClass('bg-success text-white');
        }, 100);
      }
      else
      {
        throw new Error("Error al Enviar Datos.");
      }
    })
    .catch(error => {
      bootbox.alert({
        title: "Error",
        message: "Ocurrió un Error al Enviar el Formulario. Por Favor, Intenta de Nuevo.",
        backdrop: true
      });
      setTimeout(() => {
        $('.bootbox.modal .modal-content .modal-header').addClass('bg-danger text-white');
      }, 100);
      console.error(error);
    });
  }

  // Formatear cédula en vivo
  $cedula.on("input", function () {
    let valor = $(this).val().replace(/[^0-9A-Z]/gi, "").toUpperCase();
    if (valor.length > 14) valor = valor.slice(0, 14);

    let formateada = "";
    if (valor.length <= 3) {
      formateada = valor;
    } else if (valor.length <= 9) {
      formateada = valor.slice(0, 3) + "-" + valor.slice(3);
    } else if (valor.length <= 13) {
      formateada = valor.slice(0, 3) + "-" + valor.slice(3, 9) + "-" + valor.slice(9);
    } else {
      formateada = valor.slice(0, 3) + "-" + valor.slice(3, 9) + "-" + valor.slice(9, 13) + valor[13];
    }

    $(this).val(formateada);
  });

  //Formatear cedula del acompañante
  $cedacompanante.on("input", function() {
  let value = $(this).val().replace(/[^0-9A-Z]/gi, "").toUpperCase()

  if(value.length > 14)
  {
    value=value.slice(0,14);
  }

  let cedformato = "";
  if(value.length <=3)
  {
    cedformato = value;
  }
  else if(value.length <= 9)
  {
    cedformato = value.slice(0,3) + "-" + value.slice(3);
  }
  else if(value.length <=13)
  {
    cedformato = value.slice(0,3) + "-" + value.slice(3,9) + "-" + value.slice(9)
  }
  else
  {
    cedformato  = value.slice(0, 3) + "-" + value.slice(3, 9) + "-" + value.slice(9, 13) + value[13];
  }
  $(this).val(cedformato)
});

  // Envío del formulario
  $form.on("submit", function (e) {
    e.preventDefault();

    const cedula = $cedula.val().trim();
    //const correo = $correo.val().trim();

    // Validar formato de cédula
    const cedulaValida = /^\d{3}-\d{6}-\d{4}[A-Z]$/.test(cedula);
    if (!cedulaValida)
      {
      bootbox.alert(
        {
          title: "Error",
          message: "Por Favor, Ingrese una Cédula Válida en Formato: ###-######-####X",
          backdrop: true
        });

      setTimeout(() => {
        $('.bootbox.modal .modal-content .modal-header').addClass('bg-danger text-white');
      }, 100);  
      return;
    }

    // Validar formato de correo
    // const correoValido = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correo);
    // if (!correoValido)
    //   {
    //     bootbox.alert(
    //       {
    //         title: "Error",
    //         message: "Por favor, Ingrese un Correo Electrónico Válido.",
    //         backdrop: true
    //       });

    //     setTimeout(() => {
    //       $('.bootbox.modal .modal-content .modal-header').addClass('bg-danger text-white');
    //     }, 100);  
    //     return;
    // }

 verificarCedula(cedula).then(existe => {
      if (existe) {
        bootbox.alert({
          title: "Registro Duplicado",
          message: "Ya Hay un Registro con Estos Datos.",
          backdrop: true
        });
        setTimeout(() => {
          $('.bootbox.modal .modal-content .modal-header').addClass('bg-danger text-white');
        }, 100);
      } else {
        // Preparar datos y enviar
        const data = {
          Cedula: cedula,
          Cliente: $("#cliente").val(),
          Celular: $("#celular").val(),
          Correo: $("#correo").val(),
          Acompanante: $("#acompanante").val(),
          Cedacompanante: $("#cedacompanante").val(),
          Restriccion: $("#restalimentaria").val()
        };
        enviarFormulario(data);
      }
    });
  });
});


