packer {
  required_plugins {
    amazon = {
      version = " >= 1.2.0"
      source  = "github.com/hashicorp/amazon"
    }
  }
}

variable "PASSWORD" {
  type    = string
  default = "${env("PASSWORD")}"
}

variable "DATABASE" {
  type    = string
  default = "${env("DATABASE")}"
}

variable "USER" {
  type    = string
  default = "${env("USER")}"
}

variable "ami_name" {
  type    = string
  default = null
}

variable "date_format" {
  type    = string
  default = null
}

variable "ami_description" {
  type    = string
  default = null
}

variable "aws_region" {
  type    = string
  default = null
}

variable "ami_users" {
  type    = list(string)
  default = null
}

variable "ami_regions" {
  type    = list(string)
  default = null
}

variable "aws_polling_delay_seconds" {
  type    = string
  default = null
}

variable "aws_polling_max_attempts" {
  type    = string
  default = null
}

variable "instance_type" {
  type    = string
  default = null
}

variable "source_ami" {
  type    = string
  default = null
}

variable "ssh_username" {
  type    = string
  default = null
}

variable "launch_block_device_mappings_device_name" {
  type    = string
  default = null
}

variable "launch_block_device_mappings_volume_size" {
  type    = string
  default = null
}

variable "launch_block_device_mappings_volume_type" {
  type    = string
  default = null
}

variable "launch_block_device_mappings_delete_on_termination" {
  type    = string
  default = null
}

variable "provisioner_users_source" {
  type    = string
  default = null
}

variable "provisioner_users_destination" {
  type    = string
  default = null
}

variable "provisioner_webapp_source" {
  type    = string
  default = null
}

variable "provisioner_webapp_destination" {
  type    = string
  default = null
}

variable "provisioner_shell_script" {
  type    = string
  default = null
}

source "amazon-ebs" "awsdebian" {

  ami_name        = "${var.ami_name}_${formatdate("${var.date_format}", timestamp())}"
  # ami_name        = "${var.ami_name}"
  ami_description = "${var.ami_description}"
  region          = "${var.aws_region}"
  ami_users       = "${var.ami_users}"
  ami_regions     = "${var.ami_regions}"



  aws_polling {
    delay_seconds = "${var.aws_polling_delay_seconds}"
    max_attempts  = "${var.aws_polling_max_attempts}"

  }

  instance_type = "${var.instance_type}"
  source_ami    = "${var.source_ami}"
  ssh_username  = "${var.ssh_username}"

  launch_block_device_mappings {
    device_name           = "${var.launch_block_device_mappings_device_name}"
    volume_size           = "${var.launch_block_device_mappings_volume_size}"
    volume_type           = "${var.launch_block_device_mappings_volume_type}"
    delete_on_termination = "${var.launch_block_device_mappings_delete_on_termination}"
  }
}

build {
  sources = [
    "source.amazon-ebs.awsdebian"
  ]

  provisioner "file" {
    source      = "${var.provisioner_users_source}"
    destination = "${var.provisioner_users_destination}"
  }

  provisioner "file" {
    source      = "${var.provisioner_webapp_source}"
    destination = "${var.provisioner_webapp_destination}"
  }

  provisioner "shell" {
    script = "${var.provisioner_shell_script}"
    environment_vars = [
      "PASSWORD=${var.PASSWORD}",
      "DATABASE=${var.DATABASE}",
      "USER=${var.USER}",
    ]
  }
}
